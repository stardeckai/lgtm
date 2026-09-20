/**
 * Scores lgtm's checks against a labelled synthetic corpus in evals/cases.
 * Ground truth lives in expect.json only — it is never part of a state sent to the model.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { TypeSafeClient } from "@typesafe-ai/sdk";
import { analyze, buildStates, type Job } from "../src/analyze.js";
import { CHECKS, TEST_CLASSES, type TestClass } from "../src/checks/index.js";
import { DEFAULT_THRESHOLD } from "../src/checks/types.js";
import { extractTests } from "../src/extract.js";
import { usd } from "../src/checks/index.js";
import { resolveApiKey } from "../src/init.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const CASES = path.join(ROOT, "evals", "cases");
const RESULTS = path.join(ROOT, "evals", "results");
/** Ids of cases from an extra (private) root are prefixed with this, so they cannot collide with public ids. */
const PRIVATE_PREFIX = "private/";
const ITERATIONS = path.join(ROOT, "evals", "iterations.json");
/** Every 5th case of each (check, side) group is held out. */
const HOLDOUT_EVERY = 5;
/** Threshold grid for --fit-thresholds: 0.30, 0.35, … 0.95. */
const GRID = Array.from({ length: 14 }, (_, i) => Math.round((0.3 + i * 0.05) * 100) / 100);
/** one grid step above the lowest clean threshold */
const MARGIN = 0.05;
/** A fitted threshold must keep at least this precision on all labelled cases. */
const MIN_PRECISION = 0.95;

type Expect = { fire: string[]; not_fire: string[]; class: TestClass; why: string; /** dogfood: "src/x.test.ts::test name" */ test?: string };
type Answered = { probabilities: Record<string, number>; class?: string; model?: string };
type Case = { id: string; check: string; dir: string; root: Root; expect: Expect; job: Job };
/** A corpus root: `cases/` to walk and `results/` to write answers under. */
export type Root = { cases: string; results: string; private: boolean };

/**
 * The public corpus, plus the private one when LGTM_EVALS_EXTRA points at it (a checkout of lgtm-evals-private,
 * holding `cases/` and `results/` in the same layout). Its cases are scored but not published.
 */
export function evalRoots(extra = process.env.LGTM_EVALS_EXTRA): Root[] {
  const roots: Root[] = [{ cases: CASES, results: RESULTS, private: false }];
  if (!extra) return roots;
  // Fail fast: a typo'd path would silently score the public half and then overwrite the published numbers with it.
  const cases = path.join(extra, "cases");
  if (!fs.existsSync(cases)) throw new Error(`LGTM_EVALS_EXTRA=${extra} has no cases/ directory`);
  roots.push({ cases, results: path.join(extra, "results"), private: true });
  return roots;
}
type Split = "train" | "holdout";

export function findCases(roots: Root[]): { dir: string; root: Root }[] {
  const out: { dir: string; root: Root }[] = [];
  for (const root of roots) {
    const dirs: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!e.isDirectory()) continue;
        const child = path.join(dir, e.name);
        if (fs.existsSync(path.join(child, "expect.json"))) dirs.push(child);
        else walk(child);
      }
    };
    walk(root.cases);
    out.push(...dirs.sort().map((dir) => ({ dir, root })));
  }
  return out;
}

export function loadCase({ dir, root }: { dir: string; root: Root }): Case {
  const rel = path.relative(root.cases, dir);
  const id = root.private ? PRIVATE_PREFIX + rel : rel;
  const expect = JSON.parse(fs.readFileSync(path.join(dir, "expect.json"), "utf8")) as Expect;

  // Dogfood cases point at one of this repo's own tests ("src/x.test.ts:42") and get the exact state the CLI
  // would send, so the corpus carries live hard negatives from real code instead of only synthetic ones.
  if (expect.test) {
    // "src/x.test.ts::exact test name" — by name, so inserting tests above it does not break the pointer.
    const [file, name] = expect.test.split("::");
    const job = buildStates([path.join(ROOT, file!)], { impl: true }).find((j) => j.block.name === name);
    if (!job) throw new Error(`${id}: no test block named ${JSON.stringify(name)} in ${file}`);
    return { id, check: rel.split(path.sep)[0]!, dir, root, expect, job };
  }

  const testPath = path.join(dir, "case.test.ts");
  const { tests, fileContext } = extractTests(fs.readFileSync(testPath, "utf8"), path.relative(ROOT, testPath));
  if (tests.length === 0) throw new Error(`${id}: no test block found`);
  // The first block is the case under evaluation; any further blocks are its siblings (same as buildStates).
  const block = tests[0]!;
  const siblings = tests
    .slice(1)
    .map((t) => `${t.line}: ${[...t.describePath, t.name].join(" > ")}`)
    .join("\n");

  // Run from the case dir so the diff headers say before/after, never the check id.
  const diff = fs.existsSync(path.join(dir, "before"))
    ? spawnSync("git", ["diff", "--no-index", "before", "after"], { cwd: dir, encoding: "utf8" }).stdout
    : undefined;

  return {
    id,
    check: rel.split(path.sep)[0]!,
    dir,
    root,
    expect,
    job: {
      block,
      state: {
        test_name: block.name,
        describe_path: block.describePath.join(" > "),
        test_code: block.code,
        file_context: fileContext,
        sibling_tests: siblings,
        implementation: `// ---- impl.ts\n${fs.readFileSync(path.join(dir, "impl.ts"), "utf8")}`,
        ...(diff ? { diff } : {}),
      },
    },
  };
}

// ---------------------------------------------------------------- train/holdout

/** Hash of the case SLUG only, so moving a case between check directories does not reshuffle the split. */
const slugHash = (slug: string) => createHash("sha256").update(slug).digest("hex");

let HOLDOUT: Set<string> = new Set();

/**
 * Stratified per (check, side): each group is sorted by slug hash and every 5th member held out.
 * A case is holdout if ANY of its memberships holds it out, so it is never train here and holdout there.
 */
export function computeSplit(cases: Case[]): Set<string> {
  // One draw per case, stratified by its primary label (first `fire` id, or "clean"), so ~20% of each
  // group is held out and a case is never train for one check and holdout for another.
  const groups = new Map<string, Case[]>();
  for (const c of cases) {
    const key = c.expect.fire[0] ?? "clean";
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  }
  const holdout = new Set<string>();
  for (const members of [...groups.keys()].sort().map((k) => groups.get(k)!)) {
    members.sort((a, b) => slugHash(path.basename(a.id)).localeCompare(slugHash(path.basename(b.id))));
    members.forEach((c, i) => {
      if (i % HOLDOUT_EVERY === 0) holdout.add(c.id);
    });
  }
  return holdout;
}

export const splitOf = (c: Case): Split => (HOLDOUT.has(c.id) ? "holdout" : "train");

// ---------------------------------------------------------------- results i/o

/** mkdir is atomic, so a `<file>.lock` directory is a cheap cross-process mutex. */
function withLock(file: string, fn: () => void): void {
  const lock = `${file}.lock`;
  for (let i = 0; ; i++) {
    try {
      fs.mkdirSync(lock);
      break;
    } catch {
      if (i > 2000) throw new Error(`stale lock: ${lock}`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5);
    }
  }
  try {
    fn();
  } finally {
    fs.rmdirSync(lock);
  }
}

/** Mirrors the case path under its own root's results/, so nested groups cannot collide and private answers stay private. */
export const resultPath = (c: Case) => path.join(c.root.results, `${c.root.private ? c.id.slice(PRIVATE_PREFIX.length) : c.id}.json`);
/** Run-level cost, so --offline and cache-only re-runs keep reporting what the corpus actually cost. */
const RUN_META = path.join(RESULTS, "run.json");

function readAnswers(cases: Case[]): Map<string, Answered> {
  const map = new Map<string, Answered>();
  for (const c of cases) {
    const file = resultPath(c);
    if (fs.existsSync(file)) map.set(c.id, JSON.parse(fs.readFileSync(file, "utf8")) as Answered);
  }
  return map;
}

async function runLive(cases: Case[], only?: string[]): Promise<{ answers: Map<string, Answered>; inputTokens: number; model?: string }> {
  const apiKey = resolveApiKey();
  if (!apiKey) throw new Error("no API key — run `lgtm init` or set TYPESAFE_API_KEY");
  const client = new TypeSafeClient({ apiKey, timeout: 60_000 });
  const result = await analyze(
    cases.map((c) => c.job),
    { threshold: 0, verbose: false, cacheDir: path.join(ROOT, "evals", ".cache"), concurrency: 8, ...(only ? { only } : {}) },
    client,
  );

  // On a warm cache analyze reports no model; keep the one the corpus was answered with.
  const model = result.model ?? (fs.existsSync(RUN_META) ? (JSON.parse(fs.readFileSync(RUN_META, "utf8")).model as string | undefined) : undefined);
  // Key by file AND line: dogfood cases share a file, so file alone would collapse them onto one case.
  const byBlock = new Map(cases.map((c) => [`${c.job.block.file}:${c.job.block.line}`, c]));
  const fresh = new Map<string, Answered>();
  const get = (file: string, line: number) => {
    const c = byBlock.get(`${file}:${line}`)!;
    let a = fresh.get(c.id);
    if (!a) fresh.set(c.id, (a = { probabilities: {}, ...(model ? { model } : {}) }));
    return a;
  };
  for (const f of result.findings) get(f.file, f.line).probabilities[f.checkId] = f.probability;
  for (const k of result.classes) get(k.file, k.line).class = k.testClass;

  // A --only run must never drop the probabilities it did not ask about: merge into what is on disk.
  // Several --only runs may be in flight at once (one per check being tuned), so the merge re-reads the
  // file under a per-file lock; a stale in-memory copy would otherwise drop another run's fresh answers.
  const answers = readAnswers(cases);
  for (const c of cases) {
    const a = fresh.get(c.id);
    if (!a) continue;
    const file = resultPath(c);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    withLock(file, () => {
      const prev: Answered | undefined = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : undefined;
      const merged: Answered = only && prev
        ? { ...prev, probabilities: { ...prev.probabilities, ...a.probabilities } }
        : a;
      answers.set(c.id, merged);
      fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
    });
  }
  if (result.skipped > 0) console.warn(`${result.skipped} case(s) skipped by API errors`);
  // A partial run's token count is not the corpus cost — don't overwrite it.
  if (result.inputTokens > 0 && !only) {
    fs.writeFileSync(RUN_META, JSON.stringify({ inputTokens: result.inputTokens, model: result.model }, null, 2) + "\n");
  }
  return { answers, inputTokens: result.inputTokens, ...(model ? { model } : {}) };
}

// ---------------------------------------------------------------- scoring

type Scored = { checkId: string; caseId: string; label: boolean; p: number | undefined; why: string; split: Split };

function scoreAt(rows: { label: boolean; p: number | undefined }[], t: number) {
  const tp = rows.filter((r) => r.label && (r.p ?? -1) >= t).length;
  const fp = rows.filter((r) => !r.label && (r.p ?? -1) >= t).length;
  const fn = rows.filter((r) => r.label && (r.p ?? -1) < t).length;
  const precision = tp + fp === 0 ? undefined : tp / (tp + fp);
  const recall = tp + fn === 0 ? undefined : tp / (tp + fn);
  const f1 = precision === undefined || recall === undefined || precision + recall === 0 ? undefined : (2 * precision * recall) / (precision + recall);
  return { t, tp, fp, fn, precision, recall, f1 };
}

type Score = ReturnType<typeof scoreAt>;

/** Highest-t winner on `key`; the grid is ascending so a tie naturally keeps the later (higher) threshold. */
const bestBy = (scores: Score[], key: "recall" | "f1" | "precision") =>
  scores.reduce((a, b) => ((b[key] ?? -1) >= (a[key] ?? -1) ? b : a));

/**
 * The one threshold rule lives in fitThreshold. Returns undefined when there is nothing to fit on (no positives).
 *
 * Precision first. The threshold is the lowest grid point whose precision on all labelled cases is at least
 * MIN_PRECISION, plus one grid step of margin so a negative sitting just under the line does not flip on a rerun;
 * recall is whatever that leaves. A floor rather than zero false positives: with hundreds of real negatives one
 * contested label would otherwise switch a check off. When no grid point reaches the floor, take the
 * highest-precision point with the most recall, again plus the margin.
 */
export function fitThreshold(pos: (number | undefined)[], neg: (number | undefined)[]): number | undefined {
  if (pos.length === 0) return undefined;
  const rows = [...pos.map((p) => ({ label: true, p })), ...neg.map((p) => ({ label: false, p }))];
  const scores = GRID.map((t) => scoreAt(rows, t));
  const clean = scores.filter((s) => s.tp > 0 && (s.precision ?? 0) >= MIN_PRECISION);
  // clean thresholds: the lowest one has the most recall (grid is ascending, so take the first)
  const pick = clean.length > 0 ? clean[0]! : bestBy(scores.filter((s) => s.tp > 0), "precision");
  return Math.min(GRID[GRID.length - 1]!, Math.round((pick.t + MARGIN) * 100) / 100);
}

const pct = (n: number | undefined) => (n === undefined ? "—" : n.toFixed(2));
const prf = (s: Score) => `${pct(s.precision)}/${pct(s.recall)}/${pct(s.f1)}`;

function scoreRows(cases: Case[], answers: Map<string, Answered>): Scored[] {
  const rows: Scored[] = [];
  for (const c of cases) {
    const a = answers.get(c.id);
    const split = splitOf(c);
    for (const id of c.expect.fire) rows.push({ checkId: id, caseId: c.id, label: true, p: a?.probabilities[id], why: c.expect.why, split });
    for (const id of c.expect.not_fire) rows.push({ checkId: id, caseId: c.id, label: false, p: a?.probabilities[id], why: c.expect.why, split });
  }
  return rows;
}

// ---------------------------------------------------------------- --fit-thresholds

function checkFile(id: string): string | undefined {
  const base = path.join(ROOT, "src", "checks");
  for (const cat of fs.readdirSync(base, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue;
    const file = path.join(base, cat.name, `${id}.ts`);
    if (fs.existsSync(file)) return file;
  }
  return undefined;
}

function writeThreshold(id: string, t: number): boolean {
  const file = checkFile(id);
  if (!file) {
    console.warn(`[eval] no source file for check ${id}`);
    return false;
  }
  const src = fs.readFileSync(file, "utf8");
  const pattern = /threshold: (?:DEFAULT_THRESHOLD|[0-9.]+),/;
  if (!pattern.test(src)) {
    console.warn(`[eval] ${id}: no threshold literal to rewrite`);
    return false;
  }
  let next = src.replace(pattern, `threshold: ${t === DEFAULT_THRESHOLD ? "DEFAULT_THRESHOLD" : t.toFixed(2)},`);
  // Keep the import in step with the body, or the symbol is imported and never used.
  next = next.replace(/^import .*$/gm, "").includes("DEFAULT_THRESHOLD")
    ? next.replace(/^import type \{ Check \} from "\.\.\/types\.js";$/m, `import { DEFAULT_THRESHOLD, type Check } from "../types.js";`)
    : next.replace(/^import \{ DEFAULT_THRESHOLD, type Check \} from "\.\.\/types\.js";$/m, `import type { Check } from "../types.js";`);
  fs.writeFileSync(file, next);
  return true;
}

function fitThresholds(rows: Scored[], write: boolean): void {
  const lines = [
    "| check | current | fitted (all cases) | train P/R @fitted | holdout P/R @fitted |",
    "|---|---|---|---|---|",
  ];
  for (const check of CHECKS) {
    const mine = rows.filter((r) => r.checkId === check.id);
    if (mine.length === 0) continue;
    // Thresholds are fitted on EVERY labelled case, holdout included: a one-parameter fit cannot overfit,
    // and a negative left out of the fit is a real-world false positive waiting to happen. The holdout split
    // still guards the prompt rewrites, which are the part that can overfit.
    const train = mine.filter((r) => r.split === "train");
    const fitted = fitThreshold(
      mine.filter((r) => r.label).map((r) => r.p),
      mine.filter((r) => !r.label).map((r) => r.p),
    );
    const t = fitted ?? check.threshold;
    const trainAt = scoreAt(train, t);
    const holdAt = scoreAt(mine.filter((r) => r.split === "holdout"), t);
    lines.push(
      `| \`${check.id}\` | ${check.threshold.toFixed(2)} | ${fitted === undefined ? "— (no train positives)" : fitted.toFixed(2)} | ` +
        `${pct(trainAt.precision)}/${pct(trainAt.recall)} | ${pct(holdAt.precision)}/${pct(holdAt.recall)} |`,
    );
    if (write && fitted !== undefined && fitted !== check.threshold) writeThreshold(check.id, fitted);
  }
  console.log(lines.join("\n"));
  console.log(write ? "\nthresholds written to src/checks/*" : "\ndry run — pass --write to rewrite src/checks/*");
}

// ---------------------------------------------------------------- reporting

type Iteration = { check: string; variant: string; train_f1: number; holdout_f1: number; kept: boolean };

function iterationsSection(): string[] {
  if (!fs.existsSync(ITERATIONS)) return ["## Iterations", "", "No iterations yet.", ""];
  const all = JSON.parse(fs.readFileSync(ITERATIONS, "utf8")) as Iteration[];
  if (all.length === 0) return ["## Iterations", "", "No iterations yet.", ""];
  const out = ["## Iterations", "", "Prompt-rewrite history from `evals/iterations.json`.", ""];
  for (const id of [...new Set(all.map((i) => i.check))]) {
    out.push(
      `### \`${id}\``,
      "",
      "| variant | train F1 | holdout F1 | kept |",
      "|---|---|---|---|",
      ...all.filter((i) => i.check === id).map((i) => `| ${i.variant} | ${pct(i.train_f1)} | ${pct(i.holdout_f1)} | ${i.kept ? "yes" : "no"} |`),
      "",
    );
  }
  return out;
}

function buildReport(cases: Case[], answers: Map<string, Answered>, meta: { inputTokens?: number; model?: string }): { md: string; readme: string } {
  const rows = scoreRows(cases, answers);
  const nPrivate = cases.filter((c) => c.root.private).length;
  /** "768 labelled cases (506 public + 262 private)" once the private root is loaded. */
  const counted = `${cases.length} labelled cases (${nPrivate === 0 ? "" : `${cases.length - nPrivate} public + ${nPrivate} private, `}synthetic + anonymized real-world)`;
  const countedReadme = nPrivate === 0 ? `${cases.length}` : `${cases.length - nPrivate} public + ${nPrivate} private`;
  const holdoutCases = cases.filter((c) => splitOf(c) === "holdout");

  const perCheck = CHECKS.map((check) => {
    const mine = rows.filter((r) => r.checkId === check.id);
    if (mine.length === 0) return undefined;
    const train = mine.filter((r) => r.split === "train");
    const holdout = mine.filter((r) => r.split === "holdout");
    const candidates = [...new Set([0.5, ...train.map((r) => r.p).filter((p): p is number => p !== undefined)])].sort((a, b) => a - b);
    const best = candidates.map((t) => scoreAt(train, t)).reduce((a, b) => ((b.f1 ?? -1) >= (a.f1 ?? -1) ? b : a), scoreAt(train, 1.01));
    return {
      check,
      nPos: mine.filter((r) => r.label).length,
      nNeg: mine.filter((r) => !r.label).length,
      trainOwn: scoreAt(train, check.threshold),
      holdoutOwn: scoreAt(holdout, check.threshold),
      allOwn: scoreAt(mine, check.threshold),
      at50: scoreAt(mine, 0.5),
      best,
    };
  }).filter((x): x is NonNullable<typeof x> => x !== undefined);

  const classified = (subset: Case[]) => {
    const seen = subset.filter((c) => answers.get(c.id)?.class !== undefined);
    const hits = seen.filter((c) => answers.get(c.id)!.class === c.expect.class).length;
    return { seen: seen.length, hits };
  };
  const classAll = classified(cases);
  const classHold = classified(holdoutCases);
  const classIds = Object.keys(TEST_CLASSES) as TestClass[];
  const acc = (c: { seen: number; hits: number }) => (c.seen === 0 ? "no classified cases" : `${c.hits}/${c.seen} (${(c.hits / c.seen).toFixed(2)})`);

  const own = new Map(CHECKS.map((c) => [c.id, c.threshold]));
  const misses = rows.filter((r) => r.label && (r.p ?? -1) < (own.get(r.checkId) ?? DEFAULT_THRESHOLD));
  const falsePositives = rows.filter((r) => !r.label && (r.p ?? -1) >= (own.get(r.checkId) ?? DEFAULT_THRESHOLD));

  const md = [
    "# lgtm eval results",
    "",
    `${counted} · ${rows.length} scored (check, case) pairs · model \`${meta.model ?? "cached/offline"}\``,
    "",
    `Split: ${cases.length - holdoutCases.length} train · ${holdoutCases.length} holdout.`,
    "",
    "## Per check",
    "",
    "| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |",
    "|---|---|---|---|---|---|---|---|",
    ...perCheck.map((r) =>
      `| \`${r.check.id}\` | ${r.nPos} | ${r.nNeg} | ${r.check.threshold.toFixed(2)} | ${prf(r.trainOwn)} | ${prf(r.holdoutOwn)} | ${prf(r.at50)} | ${pct(r.best.f1)} @ ${r.best.t.toFixed(2)} |`,
    ),
    "",
    `Holdout is one stratified draw per case, ~20% (${holdoutCases.length}); with ~3 held-out positives per check its numbers are a sanity check against overfitting, not a precise estimate.`,
    "",
    "Checks with no labelled case are omitted.",
    "",
    "## Test class",
    "",
    `Accuracy — all: ${acc(classAll)} · holdout: ${acc(classHold)}.`,
    "",
    "| actual \\ predicted | " + classIds.join(" | ") + " |",
    "|---|" + classIds.map(() => "---|").join(""),
    ...classIds.map(
      (actual) =>
        `| **${actual}** | ` +
        classIds.map((pred) => cases.filter((c) => c.expect.class === actual && answers.get(c.id)?.class === pred).length).join(" | ") +
        " |",
    ),
    "",
    "## Misses (labelled fire, p below the check's own threshold)",
    "",
    ...(misses.length === 0 ? ["None."] : misses.map((m) => `- \`${m.caseId}\` · \`${m.checkId}\` · p=${m.p === undefined ? "not asked" : m.p.toFixed(2)} · ${m.why}`)),
    "",
    "## False positives (labelled not_fire, p at or above the check's own threshold)",
    "",
    ...(falsePositives.length === 0 ? ["None."] : falsePositives.map((m) => `- \`${m.caseId}\` · \`${m.checkId}\` · p=${m.p!.toFixed(2)} · ${m.why}`)),
    "",
    ...iterationsSection(),
    "## Cost",
    "",
    `${meta.inputTokens ?? 0} input tokens ≈ ${usd(meta.inputTokens ?? 0)} for the full corpus (${cases.length} cases, ~${Math.round((meta.inputTokens ?? 0) / Math.max(1, cases.length))} tokens per case) · model \`${meta.model ?? "cached/offline"}\``,
    "",
    "Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).",
    "",
  ].join("\n");

  // Cold cost from state sizes plus the question text sent with every request: the measured count only covers
  // what the cache did not have.
  const questionChars = JSON.stringify(CHECKS.map((c) => [c.instructions, c.criteria])).length;
  const coldTokens = Math.round(cases.reduce((n, c) => n + JSON.stringify(c.job.state).length + questionChars, 0) / 4);
  // Pooled over every scored (check, case) pair at each check's own threshold: the number a PR reviewer feels.
  const pooled = (subset: Scored[]) => scoreAt(subset.map((r) => ({ label: r.label, p: (r.p ?? -1) - (own.get(r.checkId) ?? DEFAULT_THRESHOLD) })), 0);
  const pooledAll = pooled(rows);
  const pooledHold = pooled(rows.filter((r) => r.split === "holdout"));
  const nReal = cases.filter((c) => c.root.private || c.id.startsWith("dogfood/")).length;
  const readme = [
    "## Evals",
    "",
    `**Precision first, by construction.** Each check's threshold is fitted to the lowest point where precision stays at or above 0.95, so high precision is what the fit buys, not something the model earned on its own; the honest numbers are the false-positive count and recall. At those thresholds lgtm raises ${pooledAll.tp + pooledAll.fp} findings across ${rows.length} scored (check, case) pairs, ${pooledAll.fp} of them wrong, and misses ${pooledAll.fn} of ${pooledAll.tp + pooledAll.fn} labelled smells (recall ${pct(pooledAll.recall)}). Thresholds are fitted on every case including holdout, since a one-parameter fit cannot overfit; holdout guards the prompt wording, and ${pooledHold.fp} of ${pooledHold.tp + pooledHold.fp} holdout findings are wrong there. A linter you can ignore is a linter you will ignore, so recall is the number we trade away.`,
    "",
    `The corpus is ${countedReadme} labelled test cases, synthetic and anonymized real-world, with positives, hard negatives and genuinely good tests. ${nReal} of them are real tests from production apps, read against their implementation and labelled. The ground truth is kept in \`expect.json\` so it never reaches the model.`,
    "",
    ...(nPrivate === 0
      ? []
      : [
          `The ${nPrivate} private cases come from real Stardeck customer apps and from Stardeck's own codebase, harvested by scoring 15,000+ real test blocks and sampling around each check's threshold. That harvest is what set the thresholds: synthetic negatives were too easy, and several checks that scored 1.00 on synthetic cases were 0–30% precise on real code until they were rewritten against it. The private cases are scored in these numbers but not published, because anonymization removes names, not shape. The ${cases.length - nPrivate} public cases in \`evals/cases\` reproduce with \`pnpm eval\` alone.`,
          "",
        ]),
    `Scores are at each check's own threshold. ${holdoutCases.length} of the cases are holdout, never used to fit a threshold or a prompt.`,
    "",
    "| check | cases | threshold | precision (holdout) | recall (holdout) | precision (all) | recall (all) |",
    "|---|---|---|---|---|---|---|",
    ...perCheck.map(
      (r) =>
        `| \`${r.check.id}\` | ${r.nPos + r.nNeg} | ${r.check.threshold.toFixed(2)} | ${pct(r.holdoutOwn.precision)} | ${pct(r.holdoutOwn.recall)} | ${pct(r.allOwn.precision)} | ${pct(r.allOwn.recall)} |`,
    ),
    `| **all checks** | ${rows.length} | | ${pct(pooledHold.precision)} | ${pct(pooledHold.recall)} | ${pct(pooledAll.precision)} | ${pct(pooledAll.recall)} |`,
    "",
    `Test class accuracy: ${acc(classAll)} on all cases, ${acc(classHold)} on holdout.`,
    "",
    `A full cold run of the corpus is about ${coldTokens.toLocaleString("en-US")} input tokens ≈ ${usd(coldTokens)} (estimated from the states; the last run spent ${usd(meta.inputTokens ?? 0)} after cache hits).`,
    "",
    "Every miss and false positive is listed in [`evals/RESULTS.md`](evals/RESULTS.md). The public cases reproduce with `pnpm eval`.",
    "",
  ].join("\n");

  return { md, readme };
}

/**
 * The published numbers include the private corpus, so a public-only run must not overwrite them.
 */
export function writeReadme(section: string, hasPrivate: boolean, file = path.join(ROOT, "README.md")): void {
  if (!hasPrivate) return;
  const src = fs.readFileSync(file, "utf8");
  const start = "<!-- evals:start -->";
  const end = "<!-- evals:end -->";
  if (!src.includes(start) || !src.includes(end)) {
    console.warn("README.md has no evals markers — skipping");
    return;
  }
  fs.writeFileSync(file, src.slice(0, src.indexOf(start) + start.length) + "\n" + section + src.slice(src.indexOf(end)));
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      offline: { type: "boolean" },
      "dump-states": { type: "boolean" },
      only: { type: "string" },
      "fit-thresholds": { type: "boolean" },
      write: { type: "boolean" },
      "public-only-ok": { type: "boolean" },
    },
  });
  const roots = evalRoots();
  const hasPrivate = roots.some((r) => r.private);
  const cases = findCases(roots).map(loadCase);
  HOLDOUT = computeSplit(cases);
  console.log(`${cases.length} cases · ${cases.length - HOLDOUT.size} train · ${HOLDOUT.size} holdout`);
  if (!hasPrivate) console.log("[eval] public corpus only — the published README numbers include the private set, so they are left alone (set LGTM_EVALS_EXTRA to refresh them)");

  if (values["dump-states"]) {
    console.log(JSON.stringify(cases.map((c) => ({ case: c.id, state: c.job.state })), null, 2));
    return;
  }

  if (values["fit-thresholds"]) {
    // Fitting on the public half alone would move every threshold, so refuse unless that is the point.
    if (values.write && !hasPrivate && !values["public-only-ok"]) {
      throw new Error("refusing to refit thresholds without the private corpus: set LGTM_EVALS_EXTRA, or pass --public-only-ok to fit on the public cases alone");
    }
    fitThresholds(scoreRows(cases, readAnswers(cases)), values.write === true);
    return;
  }

  const only = values.only?.split(",").map((s) => s.trim()).filter(Boolean);
  if (only) {
    const unknown = only.filter((id) => !CHECKS.some((c) => c.id === id));
    if (unknown.length > 0) throw new Error(`unknown check id(s): ${unknown.join(", ")}`);
  }

  const live = values.offline ? undefined : await runLive(cases, only);
  const answers = live?.answers ?? readAnswers(cases);
  const past: Partial<{ inputTokens: number; model: string }> = fs.existsSync(RUN_META)
    ? JSON.parse(fs.readFileSync(RUN_META, "utf8"))
    : {};
  const model = live?.model ?? [...answers.values()].find((a) => a.model)?.model ?? past.model;
  const inputTokens = (only ? past.inputTokens : live?.inputTokens) || past.inputTokens || 0;
  const { md, readme } = buildReport(cases, answers, { inputTokens, ...(model ? { model } : {}) });

  fs.writeFileSync(path.join(ROOT, "evals", "RESULTS.md"), md);
  writeReadme(readme, hasPrivate);
  console.log(`${cases.length} cases, ${answers.size} with answers → evals/RESULTS.md`);
}

// Guarded so the test file can import fitThreshold without running the corpus.
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  main().catch((err) => {
    console.error(`[eval] ${(err as Error).message}`);
    process.exitCode = 1;
  });
}
