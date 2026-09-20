import { describe, expect, it } from "vitest";
import type { Classified, Finding } from "./analyze.js";
import { formatClasses, formatReport } from "./report.js";

const klass = (testClass: Classified["testClass"], line: number): Classified => ({
  file: "a.test.ts",
  line,
  name: "name",
  testClass,
});

const summary = { tests: 4, files: 2, skipped: 0, inputTokens: 100, classes: [] as Classified[] };

const finding = (over: Partial<Finding> = {}): Finding => ({
  file: "a.test.ts",
  line: 3,
  name: "name",
  checkId: "mocks-seam-under-test",
  probability: 0.87,
  threshold: 0.8,
  ...over,
});

describe("formatReport", () => {
  it("emits github annotations in the exact annotation syntax", () => {
    const out = formatReport([finding({ checkId: "id", probability: 0.91 })], "github", summary);
    expect(out).toBe("::warning file=a.test.ts,line=3::[id] name (0.91)");
  });

  it("writes a finding as face, location, name, then check id and blurb", () => {
    const out = formatReport(
      [finding({ file: "test/payment.test.ts", line: 42, name: "rejects expired cards", probability: 0.93 })],
      "text",
      summary,
    );
    expect(out.split("\n").slice(0, 2)).toEqual([
      '😐👏 test/payment.test.ts:42  "rejects expired cards"',
      "     mocks-seam-under-test 0.93 — Congratulations. You tested the mock.",
    ]);
  });

  it("uses the check's own face, and the magnifier for a sub-threshold finding", () => {
    const lines = (over: Partial<Finding>) => formatReport([finding(over)], "text", summary).split("\n");

    expect(lines({ checkId: "swallowed-error-as-success" })[0]!.startsWith("😐🔥")).toBe(true);
    expect(lines({ checkId: "broad-snapshot" })[0]!.startsWith("😐📸")).toBe(true);

    const quiet = lines({ probability: 0.62, threshold: 0.8 });
    expect(quiet[0]!.startsWith("😐🔍")).toBe(true);
    expect(quiet[1]).toContain("— Suspicious. Congratulations. You tested the mock.");
  });

  it("closes with the pointing finger when there are findings and the thumb when there are none", () => {
    const accusing = formatReport([finding(), finding({ line: 9 })], "text", summary);
    expect(accusing.split("\n").slice(-5, -2)).toEqual(["2 tests prove nothing.", "", "😐🫵"]);
    expect(accusing.split("\n").at(-1)).toBe("100 input tokens used (≈ $0.0000)");

    const suspicionOnly = formatReport([finding({ probability: 0.6, threshold: 0.8 })], "text", summary);
    expect(suspicionOnly).toContain("😐👍  4 tests. fine. allegedly.");
    expect(suspicionOnly).not.toContain("prove nothing");
    expect(formatReport([finding({ probability: 0.6, threshold: 0.8 })], "github", summary)).toBe("");

    const clean = formatReport([], "text", { ...summary, skipped: 2 });
    expect(clean.split("\n")[0]).toBe("😐👍  4 tests. fine. allegedly.");
    expect(clean).toContain("😐❓  2 tests skipped (API errors).");
  });

  it("counts the class distribution the tests fell into", () => {
    const classes = [
      klass("contract_integration", 1),
      klass("mocked_seam_unit", 2),
      klass("mocked_seam_unit", 3),
      klass("pure_logic", 4),
      klass("pure_logic", 5),
      klass("pure_logic", 6),
    ];
    const out = formatReport([], "text", { ...summary, classes });
    expect(out).toContain("😐🎯  1 contract-integration · 2 mocked-seam · 3 pure-logic");
    expect(formatClasses(classes.slice(0, 2))).toBe(
      '😐🎯 a.test.ts:1  "name"\n😐🧱 a.test.ts:2  "name"',
    );
  });

  it("sorts by file, then line, then probability descending", () => {
    const out = formatReport(
      [
        finding({ file: "b.test.ts", line: 1, probability: 0.9, checkId: "w" }),
        finding({ file: "a.test.ts", line: 9, probability: 0.9, checkId: "x" }),
        finding({ file: "a.test.ts", line: 2, probability: 0.85, checkId: "y" }),
        finding({ file: "a.test.ts", line: 2, probability: 0.95, checkId: "z" }),
      ],
      "text",
      summary,
    );
    const ids = out.split("\n").filter((l) => l.startsWith("     ")).map((l) => l.trim().split(" ")[0]);
    expect(ids).toEqual(["z", "y", "x", "w"]);
  });
});
