import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evalRoots, findCases, fitThreshold, loadCase, resultPath, writeReadme } from "./run.js";

describe("fitThreshold", () => {
  it("sits one step above the lowest threshold that keeps 0.95 precision, sacrificing recall", () => {
    // 0.50 would catch both positives but admits both negatives. The first clean point is 0.65 (above the
    // 0.60 negative); with the 0.05 margin the answer is 0.70, and the 0.5 positive is knowingly given up.
    expect(fitThreshold([0.9, 0.5], [0.6, 0.55])).toBe(0.7);
  });

  it("tolerates one contested negative among many positives instead of switching the check off", () => {
    // 19 positives at 0.60 and one negative at 0.90: every grid point from 0.30 scores 19/20 = 0.95, so the
    // fit stays at the bottom (0.30 + margin) rather than climbing above the lone negative and losing every positive.
    const pos = Array.from({ length: 19 }, () => 0.6);
    expect(fitThreshold(pos, [0.9])).toBe(0.35);
    // Two such negatives break the floor (18/20 = 0.90 everywhere below them): no grid point qualifies, so the
    // fallback takes the most precise point with the most recall, ties upward (0.60), plus margin.
    expect(fitThreshold(Array.from({ length: 18 }, () => 0.6), [0.9, 0.9])).toBe(0.65);
  });

  it("falls back to the most precise point when a negative outscores every positive", () => {
    // No grid point is clean. Precision peaks at 0.75 (3 of 4 positives vs the 0.90 negative) from 0.35
    // through 0.70; the highest such t is 0.70 (ties go up), plus margin = 0.75.
    expect(fitThreshold([0.8, 0.75, 0.7, 0.3], [0.9, 0.3, 0.3, 0.3])).toBe(0.75);
  });

  it("never exceeds the top of the grid", () => {
    expect(fitThreshold([0.97], [0.94])).toBe(0.95);
  });

  it("has nothing to fit without positives", () => {
    expect(fitThreshold([], [0.1, 0.2])).toBeUndefined();
  });
});

describe("extra (private) corpus root", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-evals-"));
  const dir = path.join(tmp, "cases", "realworld", "grp", "01-slug");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "impl.ts"), "export const add = (a: number, b: number) => a + b;\n");
  fs.writeFileSync(path.join(dir, "case.test.ts"), 'import { add } from "./impl";\nit("adds", () => { expect(add(1, 2)).toBe(3); });\n');
  fs.writeFileSync(
    path.join(dir, "expect.json"),
    JSON.stringify({ fire: [], not_fire: ["trivial-primitive"], class: "pure_logic", why: "fixture" }),
  );

  it("prefixes ids and writes answers under the extra root, not the public one", () => {
    const found = findCases(evalRoots(tmp)).filter((f) => f.root.private);
    expect(found.map((f) => f.dir)).toEqual([dir]);
    const c = loadCase(found[0]!);
    // The prefix is what keeps a private slug from colliding with a public case of the same path.
    expect(c.id).toBe(path.join("private", "realworld", "grp", "01-slug"));
    expect(c.check).toBe("realworld");
    // The un-prefixed path under the extra root's results/, matching the files already written there.
    expect(resultPath(c)).toBe(path.join(tmp, "results", "realworld", "grp", "01-slug.json"));
  });
});

describe("writeReadme", () => {
  const readme = (body: string) => `intro\n<!-- evals:start -->\n${body}<!-- evals:end -->\nouttro\n`;
  const file = () => {
    const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-readme-")), "README.md");
    fs.writeFileSync(f, readme("## Evals\n\nold numbers\n"));
    return f;
  };

  it("leaves the published block alone on a public-only run", () => {
    // The published numbers are scored over public + private; a public-only run would silently halve them.
    const f = file();
    writeReadme("## Evals\n\nnew numbers\n", false, f);
    expect(fs.readFileSync(f, "utf8")).toBe(readme("## Evals\n\nold numbers\n"));
  });

  it("rewrites the block when the private corpus is loaded", () => {
    const f = file();
    writeReadme("## Evals\n\nnew numbers\n", true, f);
    expect(fs.readFileSync(f, "utf8")).toBe(readme("## Evals\n\nnew numbers\n"));
  });
});
