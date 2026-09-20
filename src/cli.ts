#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { AuthenticationError, TypeSafeClient } from "@typesafe-ai/sdk";
import { analyze, buildStates, checksFor, isCached, type AnalyzeOptions, type Job } from "./analyze.js";
import { usd, CHECKS } from "./checks/index.js";
import { askKey, askSkillMode, init, installSkill, resolveApiKey, saveKey, SKILL_MODES, type SkillMode } from "./init.js";
import { c, formatClasses, formatReport, real, type Format } from "./report.js";
import readline from "node:readline/promises";

const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx|mts|cts)$/;
const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git"]);

const USAGE = `lgtm [files|dirs...]

  init                 save your TypeSafe API key, then install the /lgtm agent skill
  key [value]          swap the saved API key (prompts when no value is given)
  skill                install the /lgtm skill again (to add more agents)
  --key <value>        (init) use this key instead of prompting
  --skill <where>      (init/skill) global | project | claude | none — skip the prompt
  --yes                run without the confirmation prompt (also: init/skill defaults)
  --diff <base>        only test files changed vs base, and include the diff in the state
  --threshold <0..1>   override every check's threshold
  --only <ids,...>     run only these checks
  --skip <ids,...>     skip these checks
  --format <fmt>       text | github | json (default text)
  --concurrency <n>    parallel requests (default 4)
  --no-impl            don't send implementation source
  --lean               smaller states: 8k of implementation, no test file, no repo guidelines
  --no-cache           ignore the answer cache
  --fail               exit 1 if there are findings
  --fail-on-error      exit 1 if any test block was skipped by an API error
  --dry-run            list the blocks and state sizes that would be sent, call nothing
  --json               (dry-run) print the full states as JSON instead
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

type PlanFlags = { lean?: boolean; "no-impl"?: boolean; diff?: string };

/** The plan for a run: files, checks, estimated cost and runtime. Printed before every run and by --dry-run. */
function printPlan(jobs: Job[], files: string[], values: PlanFlags, opts: AnalyzeOptions, log = console.log): void {
  const byFile = [...new Set(jobs.map((j) => j.block.file))];
  const fresh = jobs.filter((j) => !isCached(j, opts));
  const cached = jobs.length - fresh.length;
  const tokensOf = (list: Job[]) => Math.round(list.reduce((n, j) => n + JSON.stringify(j.state).length, 0) / 4);
  const tokens = tokensOf(fresh);
  // Measured on live runs: ~1s of connection setup, then rounds of `concurrency` requests where each request
  // takes ~0.4s plus ~0.015s per 1k input tokens (7 blocks/1 worker 5.0s, 36 blocks/4 workers 5.3s full, 4.4s lean).
  const estimate = (list: Job[], totalTokens: number) => {
    if (list.length === 0) return 0;
    const workers = opts.concurrency ?? 4;
    const perRequest = 0.4 + 0.015 * (totalTokens / list.length / 1000);
    return 1 + Math.ceil(list.length / workers) * perRequest;
  };
  const seconds = estimate(fresh, tokens);
  const listed = byFile.slice(0, 8).map((f) => `  ${f}`);
  if (byFile.length > 8) listed.push(`  … and ${byFile.length - 8} more`);
  const runtime = seconds < 60 ? `${seconds.toFixed(0)}s` : `${(seconds / 60).toFixed(1)} min`;
  const cachedNote = cached > 0 ? c("dim", ` · ${cached} already cached, ${fresh.length} to send`) : "";
  log(`😐 will run on ${c("bold", `${jobs.length} tests`)} in ${c("bold", `${byFile.length} file(s)`)}, ${checksFor(jobs[0]!.state, opts).length} checks each${cachedNote}`);
  log(c("cyan", listed.join("\n")));
  log(`\nestimated cost:    ${c("yellow", `~${tokens} input tokens`)} ≈ ${c(["green", "bold"], usd(tokens))}`);
  log(`estimated runtime: ${c("yellow", `~${runtime}`)} ${c("dim", `at concurrency ${opts.concurrency ?? 4}`)}`);
  if (!values.lean && fresh.length > 0) {
    const leanJobs = buildStates(files, { impl: !values["no-impl"], diffBase: values.diff, lean: true }).filter((j) => !isCached(j, opts));
    const leanTokens = tokensOf(leanJobs);
    const leanSeconds = estimate(leanJobs, leanTokens);
    const leanRuntime = leanSeconds < 60 ? `${leanSeconds.toFixed(0)}s` : `${(leanSeconds / 60).toFixed(1)} min`;
    log(
      `\n😐🫴 ${c("bold", "--lean")} would send less context: ${c(["green", "bold"], usd(leanTokens))} and ${c("yellow", `~${leanRuntime}`)} ` +
        c("dim", `(${Math.round((1 - leanTokens / tokens) * 100)}% fewer tokens; weaker mocks-seam and would-pass-if-broken answers)`),
    );
  }
  log(c("dim", "(--json prints the states that would be sent)"));
}

async function main(): Promise<number> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      key: { type: "string" },
      skill: { type: "string" },
      yes: { type: "boolean" },
      diff: { type: "string" },
      threshold: { type: "string" },
      only: { type: "string" },
      skip: { type: "string" },
      format: { type: "string", default: "text" },
      concurrency: { type: "string" },
      "no-impl": { type: "boolean" },
      lean: { type: "boolean" },
      "no-cache": { type: "boolean" },
      fail: { type: "boolean" },
      "fail-on-error": { type: "boolean" },
      "dry-run": { type: "boolean" },
      json: { type: "boolean" },
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

  if (values.skill !== undefined && !SKILL_MODES.includes(values.skill as SkillMode)) {
    console.error(`--skill must be one of ${SKILL_MODES.join(" | ")}, got ${values.skill}`);
    return 2;
  }
  const skill = values.skill as SkillMode | undefined;

  if (positionals[0] === "init") {
    for (const file of await init({ key: values.key, skill, yes: values.yes })) console.log(`wrote ${file}`);
    console.log("😐👍  You're set. Run: lgtm --diff main");
    return 0;
  }

  if (positionals[0] === "skill") {
    const file = installSkill(skill ?? (values.yes ? "global" : await askSkillMode()));
    if (file) console.log(`wrote ${file}`);
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
  const jobs = buildStates(files, { impl: !values["no-impl"], diffBase: values.diff, lean: values.lean });
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

  if (values["dry-run"] && values.json) {
      // The raw states, for piping into a file or jq.
    console.log(JSON.stringify(jobs.map((job) => ({
      file: job.block.file,
      line: job.block.line,
      questions: [...checksFor(job.state, opts).map((c) => c.id), "test_class (choice)"],
      state: job.state,
    })), null, 2));
    return 0;
  }

  // The plan always prints; on json/github it goes to stderr so stdout stays machine-readable.
  printPlan(jobs, files, values, opts, values["dry-run"] || format === "text" ? console.log : console.error);
  if (values["dry-run"]) return 0;
  if (!values.yes) {
    if (!process.stdin.isTTY) {
      console.error(c("dim", "\nnot a terminal — pass --yes to run, or --dry-run to only estimate"));
      return 0;
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = (await rl.question("\nRun? [Y/n] ")).trim().toLowerCase();
    rl.close();
    if (answer && answer !== "y" && answer !== "yes") return 0;
    console.log("");
  }

  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.error("😐✋  No API key. Run: lgtm init");
    return 2;
  }

  let result;

  let durationMs = 0;
  try {
    // 10s per attempt is the SDK default; states can be large, so allow more.
    const client = new TypeSafeClient({ apiKey, timeout: 60_000 });
    const startedAt = Date.now();
    const progress = process.stderr.isTTY
      ? (done: number, total: number, tokens: number) => {
          const secs = ((Date.now() - startedAt) / 1000).toFixed(0);
          const bar = "█".repeat(Math.round((done / total) * 20)).padEnd(20, "░");
          process.stderr.write(`\r😐 ${bar} ${done}/${total} tests · ${tokens} tokens · ${secs}s`);
          if (done === total) process.stderr.write("\r" + " ".repeat(60) + "\r");
        }
      : undefined;
    result = await analyze(jobs, { ...opts, ...(progress ? { onProgress: progress } : {}) }, client);
    durationMs = Date.now() - startedAt;
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
      durationMs,
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
