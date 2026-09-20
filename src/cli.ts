#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { AuthenticationError, TypeSafeClient } from "@typesafe-ai/sdk";
import { analyze, buildStates, checksFor } from "./analyze.js";
import { CHECKS } from "./checks.js";
import { askKey, init, resolveApiKey, saveKey } from "./init.js";
import { formatClasses, formatReport, real, type Format } from "./report.js";

const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx|mts|cts)$/;
const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git"]);

const USAGE = `lgtm [files|dirs...]

  init                 save your TypeSafe API key and install the Claude Code skill
  key [value]          swap the saved API key (prompts when no value is given)
  --key <value>        (init) use this key instead of prompting
  --diff <base>        only test files changed vs base, and include the diff in the state
  --threshold <0..1>   override every check's threshold
  --only <ids,...>     run only these checks
  --skip <ids,...>     skip these checks
  --format <fmt>       text | github | json (default text)
  --concurrency <n>    parallel requests (default 4)
  --no-impl            don't send implementation source
  --no-cache           ignore the answer cache
  --fail               exit 1 if there are findings
  --fail-on-error      exit 1 if any test block was skipped by an API error
  --dry-run            print the states that would be sent, call nothing
  --classes            list every test with its class (🎯 integration, 🧱 mocked seam, 🔬 pure logic)
  --verbose            also show 0.5-to-threshold findings (😐🫴 "explain this")
  --list-checks        print the checks and exit
`;

function walkDir(dir: string, out: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) walkDir(path.join(dir, entry.name), out);
    } else if (TEST_FILE.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
}

function discover(targets: string[], diffBase?: string): string[] {
  if (diffBase) {
    const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
    const changed = execFileSync("git", ["diff", "--name-only", diffBase], { encoding: "utf8" })
      .split("\n")
      .filter((l) => TEST_FILE.test(l))
      .map((l) => path.relative(process.cwd(), path.join(root, l)));
    return changed.filter((f) => fs.existsSync(f));
  }
  const files: string[] = [];
  for (const target of targets.length > 0 ? targets : ["."]) {
    if (fs.statSync(target).isDirectory()) walkDir(target, files);
    else files.push(target);
  }
  return files.map((f) => path.relative(process.cwd(), path.resolve(f)));
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      key: { type: "string" },
      diff: { type: "string" },
      threshold: { type: "string" },
      only: { type: "string" },
      skip: { type: "string" },
      format: { type: "string", default: "text" },
      concurrency: { type: "string" },
      "no-impl": { type: "boolean" },
      "no-cache": { type: "boolean" },
      fail: { type: "boolean" },
      "fail-on-error": { type: "boolean" },
      "dry-run": { type: "boolean" },
      "list-checks": { type: "boolean" },
      verbose: { type: "boolean" },
      classes: { type: "boolean" },
      help: { type: "boolean" },
    },
  });

  if (values.help) {
    console.log(USAGE);
    return 0;
  }

  if (positionals[0] === "init") {
    for (const file of await init({ key: values.key })) console.log(`wrote ${file}`);
    console.log("😐👍  You're set. Run: lgtm --diff main");
    return 0;
  }

  if (positionals[0] === "key") {
    const key = positionals[1] ?? values.key ?? (await askKey());
    if (!key) {
      console.error("😐✋  No key given. Run: lgtm key <value>");
      return 2;
    }
    console.log(`wrote ${saveKey(key)}`);
    console.log("😐👍  Key swapped.");
    return 0;
  }

  if (values["list-checks"]) {
    for (const check of CHECKS) {
      console.log(`😐${check.emoji} ${check.id} — ${check.blurb}${check.diffOnly ? "  [--diff only]" : ""}`);
    }
    return 0;
  }

  const format = values.format as Format;
  if (!["text", "github", "json"].includes(format)) {
    console.error(`unknown --format ${format}`);
    return 2;
  }

  const ids = [...(values.only?.split(",") ?? []), ...(values.skip?.split(",") ?? [])];
  const unknown = ids.filter((id) => !CHECKS.some((c) => c.id === id));
  if (unknown.length > 0) {
    console.error(`unknown check id(s): ${unknown.join(", ")} — see --list-checks`);
    return 2;
  }
  const threshold = values.threshold === undefined ? undefined : Number(values.threshold);
  if (threshold !== undefined && !(threshold >= 0 && threshold <= 1)) {
    console.error(`--threshold must be between 0 and 1, got ${values.threshold}`);
    return 2;
  }

  const files = discover(positionals, values.diff);
  const jobs = buildStates(files, { impl: !values["no-impl"], diffBase: values.diff });
  if (jobs.length === 0) {
    console.error(`no test blocks found in ${files.length} file(s)`);
    return 0;
  }

  const opts = {
    threshold,
    only: values.only?.split(","),
    skip: values.skip?.split(","),
    concurrency: values.concurrency === undefined ? undefined : Number(values.concurrency),
    verbose: values.verbose,
    cacheDir: values["no-cache"] ? undefined : cacheDir(),
  };

  if (values["dry-run"]) {
    for (const job of jobs.slice(0, 3)) {
      console.log(JSON.stringify(
          { questions: [...checksFor(job.state, opts).map((c) => c.id), "test_class (choice)"], state: job.state },
          null,
          2,
        ));
    }
    const byFile = new Set(jobs.map((j) => j.block.file));
    console.log(`\n${jobs.length} test blocks in ${byFile.size} files, ${checksFor(jobs[0]!.state, opts).length} checks each`);
    console.log(`would send ${jobs.length} systemOne requests (${jobs.reduce((n, j) => n + JSON.stringify(j.state).length, 0)} state chars)`);
    return 0;
  }

  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.error("😐✋  No API key. Run: lgtm init");
    return 2;
  }

  let result;
  try {
    // 10s per attempt is the SDK default; states can be large, so allow more.
    const client = new TypeSafeClient({ apiKey, timeout: 60_000 });
    result = await analyze(jobs, opts, client);
  } catch (err) {
    if (err instanceof AuthenticationError) {
      console.error("😐✋  TypeSafe rejected the API key. Run: lgtm init");
      return 2;
    }
    throw err;
  }

  if (values.classes && format === "text") console.log(formatClasses(result.classes) + "\n");

  console.log(
    formatReport(result.findings, format, {
      classes: result.classes,
      tests: jobs.length,
      files: new Set(jobs.map((j) => j.block.file)).size,
      skipped: result.skipped,
      inputTokens: result.inputTokens,
    }),
  );

  if (values.fail && result.findings.some(real)) return 1;
  if (values["fail-on-error"] && result.skipped > 0) return 1;
  return 0;
}

function cacheDir(): string {
  const local = path.join(process.cwd(), "node_modules");
  const base = fs.existsSync(local) ? local : os.tmpdir();
  return path.join(base, ".cache", "lgtm");
}

main().then(
  (code) => process.exit(code),
  (err) => {
    console.error(err);
    process.exit(2);
  },
);
