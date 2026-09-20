import { styleText } from "node:util";
import type { Classified, Finding } from "./analyze.js";
import { CHECKS, CLASS_EMOJI, usd } from "./checks/index.js";

type Style = Parameters<typeof styleText>[0];
const COLOR = !process.env.NO_COLOR && (Boolean(process.env.FORCE_COLOR) || Boolean(process.stdout.isTTY));
/** Colour only on a terminal; plain when piped, in CI logs, or under NO_COLOR. */
export const c = (style: Style, text: string) => (COLOR ? styleText(style, text) : text);

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
    `😐🎯  ${c("green", `${count(classes, "contract_integration")} contract-integration`)} · ` +
    `${c("yellow", `${count(classes, "mocked_seam_unit")} mocked-seam`)} · ` +
    `${c("dim", `${count(classes, "pure_logic")} pure-logic`)}`
  );
}

/** One line per test with its class, for `--classes`. */
export function formatClasses(classes: Classified[]): string {
  return classes
    .map((t) => `😐${CLASS_EMOJI[t.testClass]} ${loc(t.file, t.line)}  ${c(CLASS_STYLE[t.testClass] ?? "reset", `"${t.name}"`)}`)
    .join("\n");
}

const BY_ID = new Map(CHECKS.map((c) => [c.id, c]));

function sorted(findings: Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || b.probability - a.probability,
  );
}

const p = (n: number) => n.toFixed(2);

/** A finding at or above its threshold — as opposed to a --verbose "suspicious" one. */
export const real = (f: Finding) => f.probability >= f.threshold;

/** 😐 plus the check's own glyph — or the magnifying glass for a sub-threshold (--verbose) finding. */
/** One line per finding: 😐 plus the check's own glyph — or the magnifying glass for a sub-threshold (--verbose) one. */
function line(f: Finding): string {
  const check = BY_ID.get(f.checkId);
  const suspicious = !real(f);
  const face = suspicious ? "😐🔍" : `😐${check?.emoji ?? ""}`;
  const blurb = (suspicious ? "Suspicious. " : "") + (check?.blurb ?? "");
  // severity colour: red = certain, yellow = over threshold, dim = only suspicious
  const tone: Style = suspicious ? "dim" : f.probability >= 0.9 ? "red" : "yellow";
  return `  ${face} ${c([tone, "bold"], f.checkId)} ${c(tone, p(f.probability))} ${c("dim", "— " + blurb)}`;
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
    return JSON.stringify({ findings: rows, ...summary, distribution: distribution(summary.classes) }, null, 2);
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
    out.push(`😐👍  ${c("green", `${summary.tests} tests. fine. allegedly.`)}`);
  } else {
    out.push(c(["red", "bold"], `${accused.size} tests prove nothing.`), "", "😐🫵");
  }
  out.push(distribution(summary.classes));
  if (summary.skipped > 0) out.push(`😐❓  ${c("magenta", `${summary.skipped} tests skipped (API errors).`)}`);
  const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const perTest = summary.tests > 0 ? ` (${secs(summary.durationMs / summary.tests)} per test)` : "";
  const perTestCost = summary.tests > 0 ? ` (${usd(summary.inputTokens / summary.tests)} per test)` : "";
  out.push("");
  out.push(c("dim", `${summary.inputTokens} input tokens used ≈ ${usd(summary.inputTokens)}${perTestCost}`));
  out.push(c("dim", `${secs(summary.durationMs)}${perTest}`));
  return out.join("\n");
}
