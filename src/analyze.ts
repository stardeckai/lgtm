import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  APIError,
  APIConnectionError,
  AuthenticationError,
  choice,
  noul,
  type Questions,
  type SystemOneRequest,
  type SystemOneResult,
} from "@typesafe-ai/sdk";
import { CHECKS, TEST_CLASSES, type Check, type TestClass } from "./checks.js";
import { extractTests, type TestBlock } from "./extract.js";

const IMPL_CAP = 8000;
const DIFF_CAP = 12000;
const MODEL_TAG = "jev-latest";
// Reword a check and the cached answers for it must not be reused.
const VERSION: string = createRequire(import.meta.url)("../package.json").version;
const SOURCE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];

export type State = {
  test_name: string;
  describe_path: string;
  test_code: string;
  file_context: string;
  sibling_tests: string;
  implementation?: string;
  diff?: string;
};

export type Job = { block: TestBlock; state: State };

export type Finding = {
  file: string;
  line: number;
  name: string;
  checkId: string;
  probability: number;
  /** the threshold this finding was judged against, so the report can rank it */
  threshold: number;
};

export type AnalyzeOptions = {
  threshold?: number;
  only?: string[];
  skip?: string[];
  concurrency?: number;
  /** also report findings from 0.5 up to the threshold */
  verbose?: boolean;
  /** directory for the answer cache; undefined disables caching */
  cacheDir?: string;
};

/** The slice of `TypeSafeClient` we use — lets tests pass a plain object. */
export type Client = {
  systemOne(request: SystemOneRequest<Questions>): Promise<SystemOneResult<Questions>>;
};

/** What kind of test a block is, per the `test_class` choice question. */
export type Classified = { file: string; line: number; name: string; testClass: TestClass };

export type AnalyzeResult = {
  findings: Finding[];
  classes: Classified[];
  skipped: number;
  inputTokens: number;
};

/** Loose view of an answer map, so cached JSON and live answers read the same way. */
type Answers = Record<string, { type: string; noul?: number; choice?: string }>;

/** Resolve a relative import to a file on disk, including TS-for-JS specifiers. */
function resolveImport(fromFile: string, spec: string): string | null {
  const base = path.resolve(path.dirname(fromFile), spec);
  const stripped = base.replace(/\.(js|jsx|mjs|cjs)$/, "");
  const candidates = [
    base,
    ...(stripped === base ? [] : SOURCE_EXTS.map((e) => stripped + e)),
    ...SOURCE_EXTS.map((e) => base + e),
    ...SOURCE_EXTS.map((e) => path.join(base, "index" + e)),
  ];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null;
}

function cap(text: string, limit: number): string {
  return text.length > limit ? text.slice(0, limit) + "\n/* …truncated… */" : text;
}

function gitDiff(base: string, files: string[]): string | undefined {
  try {
    return cap(execFileSync("git", ["diff", base, "--", ...files], { encoding: "utf8" }), DIFF_CAP);
  } catch (err) {
    console.warn(`[lgtm] git diff ${base} failed: ${(err as Error).message}`);
    return undefined;
  }
}

/** Read test files and build one state per test block. */
export function buildStates(files: string[], opts: { impl: boolean; diffBase?: string }): Job[] {
  const jobs: Job[] = [];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const { tests, fileContext, imports } = extractTests(source, file);
    if (tests.length === 0) continue;

    const implFiles = opts.impl || opts.diffBase ? imports.map((s) => resolveImport(file, s)).filter((p): p is string => p !== null) : [];
    const implementation = opts.impl && implFiles.length > 0
      ? cap(
          implFiles
            .map((p) => `// ---- ${path.relative(process.cwd(), p)}\n${fs.readFileSync(p, "utf8")}`)
            .join("\n"),
          IMPL_CAP,
        )
      : undefined;
    const diff = opts.diffBase ? gitDiff(opts.diffBase, [...implFiles, file]) : undefined;

    for (const block of tests) {
      const siblings = tests
        .filter((t) => t !== block)
        .map((t) => `${t.line}: ${[...t.describePath, t.name].join(" > ")}`)
        .join("\n");
      jobs.push({
        block,
        state: {
          test_name: block.name,
          describe_path: block.describePath.join(" > "),
          test_code: block.code,
          file_context: fileContext,
          sibling_tests: siblings,
          ...(implementation ? { implementation } : {}),
          ...(diff ? { diff } : {}),
        },
      });
    }
  }
  return jobs;
}

/** The checks to send for a given state, honoring --only/--skip and diff availability. */
export function checksFor(state: State, opts: AnalyzeOptions) {
  return CHECKS.filter(
    (c) =>
      (!c.diffOnly || state.diff !== undefined) &&
      (!opts.only || opts.only.includes(c.id)) &&
      !(opts.skip ?? []).includes(c.id),
  );
}

function cachePath(dir: string, state: State, checks: Check[]): string {
  const questions = checks.map((c) => c.id + c.instructions + JSON.stringify(c.criteria ?? null)).join(",");
  const hash = createHash("sha256")
    .update(JSON.stringify(state) + questions + JSON.stringify(TEST_CLASSES) + MODEL_TAG + VERSION)
    .digest("hex");
  return path.join(dir, `${hash}.json`);
}

export async function analyze(jobs: Job[], opts: AnalyzeOptions, client: Client): Promise<AnalyzeResult> {
  const findings: Finding[] = [];
  const classes: Classified[] = [];
  let skipped = 0;
  let inputTokens = 0;

  const run = async (job: Job) => {
    const checks = checksFor(job.state, opts);
    const file = opts.cacheDir ? cachePath(opts.cacheDir, job.state, checks) : undefined;

    let answers: Answers | undefined;
    if (file && fs.existsSync(file)) {
      answers = JSON.parse(fs.readFileSync(file, "utf8"));
    } else {
      const questions: Questions = {
        test_class: choice("Which kind of test is `test_code`?", TEST_CLASSES),
      };
      for (const c of checks) questions[c.id] = noul(c.instructions, c.criteria);
      try {
        const result = await client.systemOne({ state: job.state, questions });
        answers = result.answers;
        inputTokens += result.usage.input_tokens;
      } catch (err) {
        if (err instanceof AuthenticationError) throw err;
        if (err instanceof APIError || err instanceof APIConnectionError) {
          console.warn(`[lgtm] skipped ${job.block.file}:${job.block.line}: ${(err as Error).message}`);
          skipped += 1;
          return;
        }
        throw err;
      }
      if (file) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify(answers));
      }
    }

    if (!answers) return;
    const testClass = answers.test_class?.choice;
    if (testClass && testClass in TEST_CLASSES) {
      classes.push({
        file: job.block.file,
        line: job.block.line,
        name: job.block.name,
        testClass: testClass as TestClass,
      });
    }
    for (const check of checks) {
      const probability = answers[check.id]?.noul;
      if (probability === undefined) continue;
      const threshold = opts.threshold ?? check.threshold;
      if (probability >= (opts.verbose ? Math.min(0.5, threshold) : threshold)) {
        findings.push({
          file: job.block.file,
          line: job.block.line,
          name: job.block.name,
          checkId: check.id,
          probability,
          threshold,
        });
      }
    }
  };

  let next = 0;
  const workers = Math.max(1, Math.min(opts.concurrency ?? 4, jobs.length));
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (next < jobs.length) {
        const job = jobs[next++];
        if (job) await run(job);
      }
    }),
  );

  return { findings, classes, skipped, inputTokens };
}
