import { describe, expect, it } from "vitest";
import type { Classified, Finding } from "./analyze.js";
import { formatClasses, formatReport } from "./report.js";

const klass = (testClass: Classified["testClass"], line: number): Classified => ({
  file: "a.test.ts",
  line,
  name: "name",
  testClass,
});

const summary = { tests: 4, files: 2, skipped: 0, inputTokens: 100, durationMs: 6000, classes: [] as Classified[] };

const finding = (over: Partial<Finding> = {}): Finding => ({
  file: "a.test.ts",
  line: 3,
  name: "name",
  checkId: "mocks-seam-under-test",
  probability: 0.96,
  threshold: 0.8,
  ...over,
});

describe("formatReport", () => {
  it("pluralizes the verdict: 1 test proves nothing, 2 tests prove nothing", () => {
    const one = formatReport([finding()], "text", { ...summary, tests: 1 });
    expect(one).toContain("😐🫵  1 test proves nothing.");
    const two = formatReport([finding(), finding({ line: 9 })], "text", summary);
    expect(two).toContain("😐🫵  2 tests prove nothing.");
    const clean = formatReport([], "text", { ...summary, tests: 1, skipped: 1 });
    expect(clean).toContain("😐👍  1 test. fine...lgtm?");
    expect(clean).toContain("1 test skipped (API errors).");
  });

  it("json explains each check once under `checks`, not per finding", () => {
    const out = JSON.parse(
      formatReport([finding(), finding({ line: 9 }), finding({ checkId: "over-mocked" })], "json", summary),
    ) as { findings: unknown[]; checks: Record<string, { explanation: string; emoji: string; threshold: number }> };
    expect(Object.keys(out.checks).sort()).toEqual(["mocks-seam-under-test", "over-mocked"]);
    expect(out.checks["mocks-seam-under-test"]!.explanation).toMatch(/scripted mock/);
    expect(out.checks["over-mocked"]!.emoji).toBe("😐👏"); // the family gesture, same as the text output
    expect(JSON.stringify(out.findings)).not.toContain("explanation");
  });

  it("emits github annotations in the exact annotation syntax", () => {
    const out = formatReport([finding({ checkId: "id", probability: 0.96 })], "github", summary);
    expect(out).toBe("::warning file=a.test.ts,line=3::[id] name");
    const band = formatReport([finding({ checkId: "id", probability: 0.85 })], "github", summary);
    expect(band).toBe("::notice file=a.test.ts,line=3::[id] name");
  });

  it("writes a finding as location and name, then face, check id and blurb, with the probability only under --verbose", () => {
    const out = formatReport(
      [finding({ file: "test/payment.test.ts", line: 42, name: "rejects expired cards", probability: 0.96 })],
      "text",
      summary,
    );
    expect(out.split("\n").slice(0, 2)).toEqual([
      'test/payment.test.ts:42  "rejects expired cards"',
      "  😐👏 mocks-seam-under-test — The collaborator that decides this behaviour is a mock, so the test proves the mock's script, not the code; use the real one here.",
    ]);
    const loud = formatReport([finding({ probability: 0.96 })], "text", { ...summary, verbose: true });
    expect(loud.split("\n")[1]!.startsWith("  😐👏 mocks-seam-under-test 0.96 — ")).toBe(true);
  });

  it("prints the blurb, and marks a sub-threshold finding as suspicious", () => {
    const lines = (over: Partial<Finding>) => formatReport([finding(over)], "text", { ...summary, verbose: true }).split("\n");

    expect(lines({ checkId: "swallowed-error-as-success" })[1]!.startsWith("  😐🤏")).toBe(true);
    expect(lines({ checkId: "changed-in-lockstep" })[1]!.startsWith("  😐🫸")).toBe(true);

    const quiet = lines({ probability: 0.62, threshold: 0.8 });
    expect(quiet[1]!.startsWith("  😐 mocks-seam-under-test 0.62")).toBe(true);
    expect(quiet[1]).toContain("— Suspicious. The collaborator that decides this behaviour is a mock");
  });

  it("closes with the pointing finger when there are findings and the thumb when there are none", () => {
    const accusing = formatReport([finding({ probability: 0.95 }), finding({ line: 9, probability: 0.96 })], "text", summary);
    expect(accusing.split("\n").slice(-5, -4)).toEqual(["😐🫵  2 tests prove nothing."]);
    expect(accusing.split("\n").at(-1)).toBe("6.0s (1.5s per test)");

    const suspicionOnly = formatReport([finding({ probability: 0.6, threshold: 0.8 })], "text", summary);
    expect(suspicionOnly).toContain("😐👍  4 tests. fine...lgtm?");
    expect(suspicionOnly).not.toContain("prove nothing");
    expect(formatReport([finding({ probability: 0.6, threshold: 0.8 })], "github", summary)).toBe("");

    // 0.87 is over the 0.80 threshold but inside the 0.15 margin: worth a look, not an accusation
    const bandOnly = formatReport([finding({ probability: 0.87 }), finding({ line: 9, probability: 0.81 })], "text", summary);
    expect(bandOnly).toContain("😐🤞  2 tests worth a look. nothing proven, nothing disproven.");
    expect(bandOnly).toContain("😐🤞 mocks-seam-under-test — Worth a look. The collaborator");
    expect(bandOnly).not.toContain("prove nothing");
    const mixed = formatReport([finding({ probability: 0.95 }), finding({ line: 9, probability: 0.81 })], "text", summary);
    expect(mixed).toContain("😐🫵  1 test proves nothing. 1 test more worth a look.");

    const clean = formatReport([], "text", { ...summary, skipped: 2 });
    expect(clean.split("\n")[0]).toBe("😐👍  4 tests. fine...lgtm?");
    expect(clean).toContain("2 tests skipped (API errors).");
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
    expect(out).toContain("1 contract-integration · 2 mocked-seam · 3 pure-logic");
    expect(formatClasses(classes.slice(0, 2))).toBe(
      'contract-integration a.test.ts:1  "name"\nmocked-seam          a.test.ts:2  "name"',
    );
  });

  it("prints one header per test and a blank line between tests", () => {
    const out = formatReport(
      [finding({ line: 2, checkId: "x" }), finding({ line: 2, checkId: "y" }), finding({ line: 9, checkId: "z" })],
      "text",
      summary,
    );
    const lines = out.split("\n");
    expect(lines.filter((l) => l.startsWith("a.test.ts:"))).toEqual(['a.test.ts:2  "name"', 'a.test.ts:9  "name"']);
    expect(lines.slice(0, 5)).toEqual([lines[0], lines[1], lines[2], "", 'a.test.ts:9  "name"']);
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
    const ids = out.split("\n").filter((l) => l.startsWith("  😐")).map((l) => l.trim().split(" ")[1]);
    expect(ids).toEqual(["z", "y", "x", "w"]);
  });
});
