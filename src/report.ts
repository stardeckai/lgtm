import { styleText } from "node:util";
import type { Classified, Finding } from "./analyze.js";
import { CATEGORY_OF, CHECKS, EXPLANATIONS, GESTURE, usd } from "./checks/index.js";

type Style = Parameters<typeof styleText>[0];
const COLOR = !process.env.NO_COLOR && (Boolean(process.env.FORCE_COLOR) || Boolean(process.stdout.isTTY));
/** Colour only on a terminal; plain when piped, in CI logs, or under NO_COLOR. */
export const c = (style: Style, text: string) => (COLOR ? styleText(style, text) : text);

const CLASS_LABEL: Record<string, string> = { contract_integration: "contract-integration", mocked_seam_unit: "mocked-seam", pure_logic: "pure-logic" };
const CLASS_STYLE: Record<string, Style> = { contract_integration: "green", mocked_seam_unit: "yellow", pure_logic: "dim" };
const loc = (file: string, line: number) => `${c("cyan", file)}${c("dim", ":")}${c("yellow", String(line))}`;
const name = (n: string) => c("bold", `"${n}"`);

export type Format = "text" | "github" | "json";
export type Summary = {
  tests: number;
  files: number;
  skipped: number;
  inputTokens: number;
  /** wall-clock time spent in analyze(); 0 when nothing ran */
  durationMs: number;
  classes: Classified[];
  /** --verbose: also print each finding's probability. Off by default: a 0.64 next to a smell reads as a
   *  confidence, but it is a score against a fitted cut-off that moves ±0.1 between runs of the same state. */
  verbose?: boolean;
};

const count = (classes: Classified[], of: string) => classes.filter((c) => c.testClass === of).length;

/** lgtm's one approving glyph: how much of the suite actually crosses a seam. */
function distribution(classes: Classified[]): string {
  return (
    `${c("green", `${count(classes, "contract_integration")} contract-integration`)} · ` +
    `${c("yellow", `${count(classes, "mocked_seam_unit")} mocked-seam`)} · ` +
    `${c("dim", `${count(classes, "pure_logic")} pure-logic`)}`
  );
}

/** One line per test with its class, for `--classes`. */
export function formatClasses(classes: Classified[]): string {
  return classes
    .map((t) => `${c(CLASS_STYLE[t.testClass] ?? "reset", (CLASS_LABEL[t.testClass] ?? t.testClass).padEnd(21))}${loc(t.file, t.line)}  "${t.name}"`)
    .join("\n");
}

const BY_ID = new Map(CHECKS.map((c) => [c.id, c]));

function sorted(findings: Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || b.probability - a.probability,
  );
}

const p = (n: number) => n.toFixed(2);
/** "1 test" / "2 tests"; also "1 test proves" / "2 tests prove" via the verb pair. */
export const tests = (n: number, verb?: [singular: string, plural: string]) =>
  `${n} ${n === 1 ? "test" : "tests"}${verb ? ` ${n === 1 ? verb[0] : verb[1]}` : ""}`;

/** A finding at or above its threshold — as opposed to a --verbose "suspicious" one. */
export const real = (f: Finding) => f.probability >= f.threshold;

/**
 * How far above its threshold a finding must sit to count as proven. Measured on identical states sent five
 * times, 97% of answers move less than 0.10 between runs, so the band just over the line is where a keeper
 * can land on a bad draw; three steps up it cannot.
 */
export const CERTAIN_MARGIN = 0.15;
/** A finding well clear of its threshold: the ones the verdict counts and --fail blocks on. */
export const highLine = (threshold: number, high?: number) => high ?? Math.min(0.95, threshold + CERTAIN_MARGIN);
export const certain = (f: Finding) => real(f) && f.probability >= highLine(f.threshold, f.high);

/** One line per finding: the family's gesture (🤏 assertions, 👏 mocks, 🤌 scope, 🫸 diff), then id, blurb. */
function line(f: Finding, verbose: boolean): string {
  const check = BY_ID.get(f.checkId);
  const suspicious = !real(f);
  const probable = !suspicious && !certain(f);
  const blurb = (suspicious ? "Suspicious. " : probable ? "Worth a look. " : "") + (check?.blurb ?? "");
  // severity colour: red = certain, yellow = over threshold but within noise of it, dim = only suspicious
  const tone: Style = suspicious ? "dim" : probable ? "yellow" : "red";
  const gesture = suspicious ? "😐" : probable ? "😐🤞" : GESTURE[CATEGORY_OF[f.checkId] ?? "scope"];
  const score = verbose ? ` ${c(tone, p(f.probability))}` : "";
  return `  ${gesture} ${c([tone, "bold"], f.checkId)}${score} ${c("dim", "— " + blurb)}`;
}

/** Findings grouped per test: one header (location + name), one line per check, a blank line between tests. */
function blocks(rows: Finding[], verbose: boolean): string[] {
  const out: string[] = [];
  let key = "";
  for (const f of rows) {
    const k = `${f.file}:${f.line}`;
    if (k !== key) {
      if (out.length > 0) out.push("");
      out.push(`${loc(f.file, f.line)}  ${name(f.name)}`);
      key = k;
    }
    out.push(line(f, verbose));
  }
  return out;
}

export function formatReport(findings: Finding[], format: Format, summary: Summary): string {
  const rows = sorted(findings);
  if (format === "json") {
    // Explain each check once, under `checks`, so findings stay one line each.
    const used = [...new Set(rows.map((f) => f.checkId))];
    const checks = Object.fromEntries(
      used.map((id) => {
        const check = BY_ID.get(id);
        return [id, { emoji: GESTURE[CATEGORY_OF[id] ?? "scope"], blurb: check?.blurb, threshold: check?.threshold, explanation: EXPLANATIONS[id] }];
      }),
    );
    return JSON.stringify({ findings: rows, checks, ...summary, distribution: distribution(summary.classes) }, null, 2);
  }
  if (format === "github") {
    return rows
      .filter(real)
      .map((f) => `::${certain(f) ? "warning" : "notice"} file=${f.file},line=${f.line}::[${f.checkId}] ${f.name}`)
      .join("\n");
  }

  // Only findings well clear of the line accuse anyone; the band just over it is worth a look, and
  // sub-threshold (--verbose) rows are shown but count for nothing.
  const accused = new Set(rows.filter(certain).map((f) => `${f.file}:${f.line}`));
  const lookAt = new Set(rows.filter((f) => real(f) && !certain(f)).map((f) => `${f.file}:${f.line}`));
  for (const k of accused) lookAt.delete(k);
  const out = blocks(rows, summary.verbose ?? false);
  if (out.length > 0) out.push("");
  if (accused.size > 0) {
    const more = lookAt.size > 0 ? c("yellow", ` ${tests(lookAt.size)} more worth a look.`) : "";
    out.push(`😐🫵  ${c(["red", "bold"], `${tests(accused.size, ["proves", "prove"])} nothing.`)}${more}`);
  } else if (lookAt.size > 0) {
    out.push(`😐🤞  ${c(["yellow", "bold"], `${tests(lookAt.size)} worth a look.`)} ${c("dim", "nothing proven, nothing disproven.")}`);
  } else {
    out.push(`😐👍  ${c("green", `${tests(summary.tests)}. fine...lgtm?`)}`);
  }
  out.push(distribution(summary.classes));
  if (summary.skipped > 0) out.push(c("magenta", `${tests(summary.skipped)} skipped (API errors).`));
  const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const perTest = summary.tests > 0 ? ` (${secs(summary.durationMs / summary.tests)} per test)` : "";
  const perTestCost = summary.tests > 0 ? ` (${usd(summary.inputTokens / summary.tests)} per test)` : "";
  out.push("");
  out.push(c("dim", `${summary.inputTokens} input tokens used ≈ ${usd(summary.inputTokens)}${perTestCost}`));
  out.push(c("dim", `${secs(summary.durationMs)}${perTest}`));
  return out.join("\n");
}
