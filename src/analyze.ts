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
import { CHECKS, TEST_CLASSES, type Check, type TestClass } from "./checks/index.js";
import { extractTests, type TestBlock } from "./extract.js";

const IMPL_CAP = 40_000;
const IMPL_TOTAL_CAP = 60_000;
const LEAN_IMPL_CAP = 8_000;
const TEST_FILE_CAP = 40_000;
const GUIDELINES_CAP = 8_000;
const DIFF_CAP = 20_000;
/** TypeSafe allows 32k tokens of state; at ~4 chars/token we trim back to this. */
const STATE_BUDGET = 100_000;
const TRUNCATED = "\n/* …truncated… */";
const GUIDELINE_FILES = ["CLAUDE.md", "AGENTS.md", "CONTRIBUTING.md", ".cursorrules", "TESTING.md"];
/** Lowest priority first — what fitBudget eats before it touches anything above it. */
const TRIM_ORDER = ["diff", "repo_guidelines", "test_file", "implementation", "file_context"] as const;
const MODEL_TAG = "jev-latest";
// Reword a check and the cached answers for it must not be reused.
const VERSION: string = createRequire(import.meta.url)("../package.json").version;
const SOURCE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts"];
export const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx|mts|cts)$/;

export type State = {
  test_name: string;
  describe_path: string;
  test_code: string;
  file_context: string;
  sibling_tests: string;
  implementation?: string;
  /** whole test file, with the block under evaluation fenced by marker comments */
  test_file?: string;
  /** the "test"-ish sections of CLAUDE.md/AGENTS.md/… between the test file and the git root */
  repo_guidelines?: string;
  diff?: string;
};

export type Job = {
  block: TestBlock;
  state: State;
  /** false for a block the diff did not touch (an old block of a touched file, or a test pulled in by changed
   *  implementation): it still gets the diff and every other check, but not the diff-only ones. */
  touched?: boolean;
};

export type Finding = {
  file: string;
  line: number;
  name: string;
  checkId: string;
  probability: number;
  /** the threshold this finding was judged against, so the report can rank it */
  threshold: number;
  /** the check's own high-confidence line, when it overrides the standard margin */
  high?: number;
};

export type AnalyzeOptions = {
  threshold?: number;
  only?: string[];
  skip?: string[];
  concurrency?: number;
  /** called after each block finishes (answered, cached or skipped) with the running totals */
  onProgress?: (done: number, total: number, inputTokens: number) => void;
  /** called with the running input-token total the moment a request is billed, so a later throw does not lose the spend */
  onSpend?: (inputTokens: number) => void;
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
  /** model that answered the live requests; undefined when every answer came from cache */
  model?: string;
};

/** Loose view of an answer map, so cached JSON and live answers read the same way. */
type Answers = Record<string, { type: string; noul?: number; choice?: string }>;

/** The file a path points at, trying TS-for-JS specifiers, extensions and index files. */
function resolveBase(base: string): string | null {
  const stripped = base.replace(/\.(js|jsx|mjs|cjs)$/, "");
  const candidates = [
    base,
    ...(stripped === base ? [] : SOURCE_EXTS.map((e) => stripped + e)),
    ...SOURCE_EXTS.map((e) => base + e),
    ...SOURCE_EXTS.map((e) => path.join(base, "index" + e)),
  ];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) ?? null;
}

/** `compilerOptions.paths` of the nearest tsconfig, with every target already absolute. */
type Aliases = Record<string, string[]>;

const aliasCache = new Map<string, Aliases | null>();

/** JSON with comments and trailing commas — string-aware, so a `"$schema"` URL survives. */
function parseJsonc(text: string): Record<string, unknown> | null {
  const bare = text.replace(/("(?:\\.|[^"\\])*")|\/\*[\s\S]*?\*\/|\/\/.*$/gm, (_m, str?: string) => str ?? "");
  try {
    return JSON.parse(bare.replace(/,(\s*[}\]])/g, "$1")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Read a tsconfig's `baseUrl`/`paths`, merged over those of the config it extends (child wins). */
function loadAliases(file: string, depth = 0): { baseUrl?: string; paths: Aliases } {
  const json = fs.existsSync(file) ? parseJsonc(fs.readFileSync(file, "utf8")) : null;
  if (!json) return { paths: {} };
  const dir = path.dirname(file);
  const extend = json.extends;
  // A bare `extends` points into node_modules; not worth resolving for context gathering.
  const inherited =
    typeof extend === "string" && depth < 5 && /^\.\.?[\\/]/.test(extend)
      ? loadAliases(path.resolve(dir, extend.endsWith(".json") ? extend : extend + ".json"), depth + 1)
      : { paths: {} };
  const opts = (json.compilerOptions ?? {}) as { baseUrl?: string; paths?: Record<string, string[]> };
  const baseUrl = opts.baseUrl === undefined ? inherited.baseUrl : path.resolve(dir, opts.baseUrl);
  const own = Object.fromEntries(
    Object.entries(opts.paths ?? {}).map(([k, targets]) => [
      k,
      targets.map((t) => path.resolve(baseUrl ?? dir, t)),
    ]),
  );
  return { baseUrl, paths: { ...inherited.paths, ...own } };
}

/** Nearest tsconfig walking up to the git root, cached per directory. */
function nearestAliases(dir: string): Aliases | null {
  const hit = aliasCache.get(dir);
  if (hit !== undefined) return hit;
  const file = path.join(dir, "tsconfig.json");
  const parent = path.dirname(dir);
  const result = fs.existsSync(file)
    ? loadAliases(file).paths
    : fs.existsSync(path.join(dir, ".git")) || parent === dir
      ? null
      : nearestAliases(parent);
  aliasCache.set(dir, result);
  return result;
}

/** Resolve a bare specifier through tsconfig `paths` (`@/x` → `src/x`), first hit wins. */
function resolveAlias(fromFile: string, spec: string): string | null {
  const aliases = nearestAliases(path.dirname(path.resolve(fromFile)));
  if (!aliases) return null;
  for (const [pattern, targets] of Object.entries(aliases)) {
    const star = pattern.indexOf("*");
    let middle = "";
    if (star < 0) {
      if (pattern !== spec) continue;
    } else {
      const head = pattern.slice(0, star);
      const tail = pattern.slice(star + 1);
      if (!spec.startsWith(head) || !spec.endsWith(tail) || spec.length < head.length + tail.length) continue;
      middle = spec.slice(head.length, spec.length - tail.length);
    }
    for (const target of targets) {
      const hit = resolveBase(star < 0 ? target : target.replaceAll("*", middle));
      if (hit) return hit;
    }
  }
  return null;
}

/** Resolve an import to a file on disk: relative specifiers, plus tsconfig path aliases. */
export function resolveImport(fromFile: string, spec: string): string | null {
  if (spec.startsWith(".") || path.isAbsolute(spec)) {
    return resolveBase(path.resolve(path.dirname(fromFile), spec));
  }
  return resolveAlias(fromFile, spec);
}

function cap(text: string, limit: number): string {
  return text.length > limit ? text.slice(0, limit) + TRUNCATED : text;
}

/** The whole test file with the block fenced, so the model sees what the rest of the file already covers. */
function markTestFile(source: string, block: TestBlock): string {
  const lines = source.split("\n");
  lines.splice(block.endLine, 0, "// <<< end");
  lines.splice(block.line - 1, 0, "// >>> test under evaluation");
  return cap(lines.join("\n"), TEST_FILE_CAP);
}

/** Markdown sections whose heading mentions tests, from the heading to the next same-or-higher one. */
function testSections(markdown: string): string {
  const out: string[] = [];
  let level = 0;
  let fenced = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) fenced = !fenced;
    const heading = fenced ? null : /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const depth = heading[1]!.length;
      // A nested test heading inside a test section must not end the outer one.
      if (/test/i.test(heading[2]!)) level = level === 0 ? depth : Math.min(level, depth);
      else if (level > 0 && depth <= level) level = 0;
    }
    if (level > 0) out.push(line);
  }
  return out.join("\n");
}

/** Walk up from the test file to the git root, collecting each guideline file's test sections. */
function repoGuidelines(testFile: string): string | undefined {
  const parts: string[] = [];
  const seenSections = new Set<string>();
  let dir = path.dirname(path.resolve(testFile));
  for (;;) {
    for (const name of GUIDELINE_FILES) {
      const file = path.join(dir, name);
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
      const sections = testSections(fs.readFileSync(file, "utf8")).trim();
      // CLAUDE.md and AGENTS.md are often byte-identical copies; send each distinct section once.
      if (sections && !seenSections.has(sections)) {
        seenSections.add(sections);
        parts.push(`// ---- ${path.relative(process.cwd(), file)}\n${sections}`);
      }
    }
    // `.git` is a directory in a checkout and a file in a worktree.
    if (fs.existsSync(path.join(dir, ".git"))) break;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return parts.length > 0 ? cap(parts.join("\n\n"), GUIDELINES_CAP) : undefined;
}

/**
 * Trim the state back under the char budget, lowest priority first.
 * test_code, test_name, describe_path and sibling_tests are never touched.
 */
export function fitBudget(state: State, budget = STATE_BUDGET): { field: string; saved: number }[] {
  const trims: { field: string; saved: number }[] = [];
  for (const field of TRIM_ORDER) {
    const size = JSON.stringify(state).length;
    if (size <= budget) break;
    const value = state[field];
    if (!value) continue;
    // The marker costs one more char once JSON-escaped than it does raw.
    const keep = Math.max(0, value.length - (size - budget) - (JSON.stringify(TRUNCATED).length - 2));
    const next = keep === 0 ? undefined : value.slice(0, keep) + TRUNCATED;
    trims.push({ field, saved: value.length - (next?.length ?? 0) });
    if (next !== undefined) state[field] = next;
    else if (field === "file_context") state.file_context = "";
    else delete state[field];
  }
  return trims;
}

export type Range = [number, number];

/** Runs git and returns trimmed stdout; throws when git does. Probes fail on purpose, so stderr is dropped. */
export type GitRun = (args: string[]) => string;
const gitRun: GitRun = (args) =>
  execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

const tryGit = (run: GitRun, args: string[]): string | null => {
  try {
    return run(args);
  } catch {
    return null;
  }
};

/**
 * node:util parseArgs has no optional-value type: a bare `--diff` throws, and `--diff --yes` eats the next flag.
 * Bare when nothing follows, a flag follows, or a path follows (`lgtm --diff src` means "default base, under src").
 */
export function normalizeDiffFlag(argv: string[], exists: (p: string) => boolean = fs.existsSync): string[] {
  const bare = (next: string | undefined) => next === undefined || next.startsWith("-") || exists(next);
  return argv.map((a, i) => (a === "--diff" && bare(argv[i + 1]) ? "--diff=" : a));
}

/** The branch a bare `--diff` compares against: origin's HEAD, else origin/main, else main, else master. */
export function defaultDiffBase(run: GitRun = gitRun): string {
  const head = tryGit(run, ["symbolic-ref", "-q", "refs/remotes/origin/HEAD"]);
  if (head) return head.trim().replace(/^refs\/remotes\//, "");
  for (const ref of ["origin/main", "main", "master"]) {
    if (tryGit(run, ["rev-parse", "--verify", "--quiet", ref])) return ref;
  }
  throw new Error("--diff: no default branch found (tried origin/HEAD, origin/main, main, master) — pass --diff <ref>");
}

/** New-side line ranges of a `git diff -U0` output. A pure deletion (`+c,0`) counts as touching line c. */
export function changedRanges(hunks: string): Range[] {
  const out: Range[] = [];
  for (const m of hunks.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1]);
    const count = m[2] === undefined ? 1 : Number(m[2]);
    out.push([start, count === 0 ? start : start + count - 1]);
  }
  return out;
}

export function blockTouched(block: { line: number; endLine: number }, ranges: Range[]): boolean {
  return ranges.some(([from, to]) => block.line <= to && block.endLine >= from);
}

/**
 * The implementation files a test file reaches: what it imports at runtime, and whatever those forward through
 * `export … from`, so an import of a barrel `index.ts` reaches the module behind it. Barrels are tiny; their own
 * imports are not followed (see AGENTS.md for the measurements). Same list for the state and for `--diff`.
 */
export function implFiles(file: string, imports: string[]): string[] {
  const seen = new Set<string>([path.resolve(file)]);
  const out: string[] = [];
  const queue = imports.map((spec) => ({ from: file, spec }));
  for (let next = queue.shift(); next; next = queue.shift()) {
    const resolved = resolveImport(next.from, next.spec);
    if (!resolved || seen.has(resolved) || !SOURCE_EXTS.includes(path.extname(resolved))) continue;
    seen.add(resolved);
    out.push(resolved);
    for (const spec of extractTests(fs.readFileSync(resolved, "utf8"), resolved).reexports) queue.push({ from: resolved, spec });
  }
  return out;
}

/** Does this test file reach any of `changed`, through the same files the state would carry? */
function importsAny(file: string, changed: Set<string>): boolean {
  let source: string;
  try {
    source = fs.readFileSync(file, "utf8");
  } catch {
    return false;
  }
  return implFiles(file, extractTests(source, file).imports).some((p) => changed.has(p));
}

export type DiffSelection = {
  /** the ref as printed in the plan, e.g. "origin/main" */
  label: string;
  /** what everything is actually compared against: the merge base of `label` and HEAD */
  base: string;
  /** absolute paths of the test files to audit */
  files: string[];
  /** keeps only blocks that intersect a changed range; absent with allBlocks */
  blockFilter?: (file: string, block: TestBlock) => boolean;
  /** whether this block is itself new or changed — the diff-only checks are meaningless otherwise */
  touched: (file: string, block: TestBlock) => boolean;
};

/**
 * The tests affected by the work in progress: test files changed vs the merge base (tracked or untracked),
 * plus tests whose one-hop imports include a changed implementation file. `candidates` is only walked when
 * there is a changed implementation file to match against.
 */
export function diffSelection(
  ref: string | undefined,
  candidates: () => string[],
  opts: { allBlocks?: boolean } = {},
  run: GitRun = gitRun,
): DiffSelection {
  const label = ref ?? defaultDiffBase(run);
  // git's own stderr is swallowed, so say what is wrong instead of failing inside the next command.
  if (!tryGit(run, ["rev-parse", "--verify", "--quiet", label])) throw new Error(`--diff: unknown ref ${label}`);
  // A branch behind origin/main must not report main's own commits as its changes.
  const base = tryGit(run, ["merge-base", label, "HEAD"]) ?? label;
  const root = run(["rev-parse", "--show-toplevel"]);
  const changed = [
    ...run(["diff", "--name-only", base]).split("\n"),
    ...run(["ls-files", "--others", "--exclude-standard"]).split("\n"),
  ]
    .filter(Boolean)
    .map((f) => path.resolve(root, f))
    .filter((f) => fs.existsSync(f));

  const changedTests = changed.filter((f) => TEST_FILE.test(f));
  const changedImpl = new Set(changed.filter((f) => !TEST_FILE.test(f) && SOURCE_EXTS.includes(path.extname(f))));
  // The test did not move but the code under it did, so the whole file is back in scope.
  const viaImpl =
    changedImpl.size === 0
      ? []
      : candidates().filter((f) => !changedTests.includes(f) && importsAny(f, changedImpl));
  const files = [...changedTests, ...viaImpl];

  const ranges = new Map<string, Range[]>();
  // Untracked files diff to nothing; an empty range list means the whole file is new.
  for (const file of changedTests) ranges.set(file, changedRanges(run(["diff", "-U0", base, "--", file])));
  const touched = (file: string, block: TestBlock) => {
    const hit = ranges.get(path.resolve(file));
    return hit !== undefined && (hit.length === 0 || blockTouched(block, hit));
  };
  // A file pulled in by its changed implementation has no ranges: keep all of its blocks, touched or not.
  const blockFilter = (file: string, block: TestBlock) => !ranges.has(path.resolve(file)) || touched(file, block);
  return { label, base, files, touched, ...(opts.allBlocks ? {} : { blockFilter }) };
}

function gitDiff(base: string, files: string[]): string | undefined {
  try {
    const tracked = execFileSync("git", ["diff", base, "--", ...files], { encoding: "utf8" });
    // An untracked file has no diff against any base; show it as wholly added so the diff checks can see it.
    const known = new Set(execFileSync("git", ["ls-files", "--", ...files], { encoding: "utf8" }).split("\n").filter(Boolean));
    const added = files
      .filter((f) => !known.has(path.relative(process.cwd(), path.resolve(f)))) // ls-files prints cwd-relative paths
      .map((f) => {
        try {
          return execFileSync("git", ["diff", "--no-index", "--", "/dev/null", f], { encoding: "utf8" });
        } catch (err) {
          return String((err as { stdout?: string }).stdout ?? ""); // exits 1 when the file is non-empty
        }
      });
    return cap([tracked, ...added].join(""), DIFF_CAP);
  } catch (err) {
    console.warn(`[lgtm] git diff ${base} failed: ${(err as Error).message}`);
    return undefined;
  }
}

/** Retry a request on 429 with backoff (1s, 2s, 4s); anything else propagates. */
async function withRateLimitRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err) {
      const status = (err as { status?: number }).status;
      const limited = status === 429 || /429|rate limit/i.test((err as Error).message ?? "");
      if (!limited || i >= attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
}

/** Read test files and build one state per test block. */
export function buildStates(
  files: string[],
  opts: {
    impl: boolean;
    diffBase?: string;
    lean?: boolean;
    blockFilter?: (file: string, block: TestBlock) => boolean;
    touched?: (file: string, block: TestBlock) => boolean;
  },
): Job[] {
  const jobs: Job[] = [];
  const guidelineCache = new Map<string, string | undefined>();
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    const { tests, fileContext, imports } = extractTests(source, file);
    if (tests.length === 0) continue;

    const direct = opts.impl || opts.diffBase ? implFiles(file, imports) : [];
    // No transitive hop through imports: it was 28% of every request on this repo and the evals never saw it;
    // dogfood scores did not move without it, while the whole test file is load-bearing (see AGENTS.md).
    const implementation = opts.impl && direct.length > 0
      ? cap(
          direct
            .map((p) => cap(`// ---- ${path.relative(process.cwd(), p)}\n${fs.readFileSync(p, "utf8")}`, opts.lean ? LEAN_IMPL_CAP : IMPL_CAP))
            .join("\n"),
          opts.lean ? LEAN_IMPL_CAP : IMPL_TOTAL_CAP,
        )
      : undefined;
    const diff = opts.diffBase ? gitDiff(opts.diffBase, [...direct, file]) : undefined;
    if (!guidelineCache.has(path.dirname(path.resolve(file)))) {
      guidelineCache.set(path.dirname(path.resolve(file)), opts.lean ? undefined : repoGuidelines(file));
    }
    const guidelines = guidelineCache.get(path.dirname(path.resolve(file)));

    for (const block of tests) {
      if (opts.blockFilter && !opts.blockFilter(file, block)) continue;
      const siblings = tests
        .filter((t) => t !== block)
        .map((t) => `${t.line}: ${[...t.describePath, t.name].join(" > ")}`)
        .join("\n");
      jobs.push({
        block,
        ...(opts.touched ? { touched: opts.touched(file, block) } : {}),
        state: {
          test_name: block.name,
          describe_path: block.describePath.join(" > "),
          test_code: block.code,
          file_context: fileContext,
          sibling_tests: siblings,
          ...(implementation ? { implementation } : {}),
          ...(opts.lean ? {} : { test_file: markTestFile(source, block) }),
          ...(guidelines ? { repo_guidelines: guidelines } : {}),
          ...(diff ? { diff } : {}),
        },
      });
      const trims = fitBudget(jobs[jobs.length - 1]!.state);
      if (trims.length > 0 && process.env.LGTM_DEBUG) {
        console.warn(
          `[lgtm] ${block.file}:${block.line} trimmed ${trims.map((t) => `${t.field} -${t.saved}`).join(", ")}`,
        );
      }
    }
  }
  return jobs;
}

/**
 * The checks to send for a given state, honoring --only/--skip and diff availability. The diff-only checks
 * also need the block itself to be new or changed; on an untouched block they only ever misfire.
 */
export function checksFor(state: State, opts: AnalyzeOptions, touched = true) {
  return CHECKS.filter(
    (c) =>
      (!c.diffOnly || (state.diff !== undefined && touched)) &&
      (!opts.only || opts.only.includes(c.id)) &&
      !(opts.skip ?? []).includes(c.id),
  );
}

/** Whether a block's answer is already on disk for these options — the plan uses it to estimate only the misses. */
export function isCached(job: Job, opts: AnalyzeOptions): boolean {
  if (!opts.cacheDir) return false;
  const checks = checksFor(job.state, opts, job.touched);
  return checks.length > 0 && fs.existsSync(cachePath(opts.cacheDir, job.state, checks));
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
  let model: string | undefined;

  const run = async (job: Job) => {
    const checks = checksFor(job.state, opts, job.touched);
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
        const result = await withRateLimitRetry(() => client.systemOne({ state: job.state, questions }));
        answers = result.answers;
        inputTokens += result.usage.input_tokens;
        opts.onSpend?.(inputTokens);
        model = result.model;
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
      const raw = answers[check.id]?.noul;
      if (raw === undefined) continue;
      const probability = check.invert ? Math.round((1 - raw) * 100) / 100 : raw;
      const threshold = opts.threshold ?? check.threshold;
      if (probability >= (opts.verbose ? Math.min(0.5, threshold) : threshold)) {
        findings.push({
          file: job.block.file,
          line: job.block.line,
          name: job.block.name,
          checkId: check.id,
          probability,
          threshold,
          // a pinned high line belongs to the check's own threshold; under --threshold the standard margin applies
          ...(check.high !== undefined && opts.threshold === undefined ? { high: check.high } : {}),
        });
      }
    }
  };

  let next = 0;
  let done = 0;
  // A throwing worker must not leave its siblings billing into a total the caller has already written: stop
  // handing out jobs, let what is in flight settle, then raise the first failure with the accounting complete.
  let failure: { err: unknown } | undefined;
  const workers = Math.max(1, Math.min(opts.concurrency ?? 4, jobs.length));
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (next < jobs.length && !failure) {
        const job = jobs[next++];
        if (job) {
          try {
            await run(job);
          } catch (err) {
            failure ??= { err };
            return;
          }
          opts.onProgress?.(++done, jobs.length, inputTokens);
        }
      }
    }),
  );
  if (failure) throw failure.err;

  return { findings, classes, skipped, inputTokens, ...(model ? { model } : {}) };
}
