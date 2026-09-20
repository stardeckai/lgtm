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

/** One line per finding: the family's gesture (🤏 assertions, 👏 mocks, 🤌 scope, 🫸 diff), then id, probability, blurb. */
function line(f: Finding): string {
  const check = BY_ID.get(f.checkId);
  const suspicious = !real(f);
  const blurb = (suspicious ? "Suspicious. " : "") + (check?.blurb ?? "");
  // severity colour: red = certain, yellow = over threshold, dim = only suspicious
  const tone: Style = suspicious ? "dim" : f.probability >= 0.9 ? "red" : "yellow";
  const gesture = suspicious ? "😐" : GESTURE[CATEGORY_OF[f.checkId] ?? "scope"];
  return `  ${gesture} ${c([tone, "bold"], f.checkId)} ${c(tone, p(f.probability))} ${c("dim", "— " + blurb)}`;
}

/** Findings grouped per test: one header (location + name), one line per check, a blank line between tests. */
function blocks(rows: Finding[]): string[] {
  const out: string[] = [];
  let key = "";
  for (const f of rows) {
    const k = `${f.file}:${f.line}`;
    if (k !== key) {
      if (out.length > 0) out.push("");
      out.push(`${loc(f.file, f.line)}  ${name(f.name)}`);
      key = k;
    }
    out.push(line(f));
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
      .map((f) => `::warning file=${f.file},line=${f.line}::[${f.checkId}] ${f.name} (${p(f.probability)})`)
      .join("\n");
  }

  // Sub-threshold (--verbose) rows are shown but do not accuse anyone.
  const accused = new Set(rows.filter(real).map((f) => `${f.file}:${f.line}`));
  const out = blocks(rows);
  if (out.length > 0) out.push("");
  if (accused.size === 0) {
    out.push(`😐👍  ${c("green", `${tests(summary.tests)}. fine. allegedly.`)}`);
  } else {
    out.push(`😐🫵  ${c(["red", "bold"], `${tests(accused.size, ["proves", "prove"])} nothing.`)}`);
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
