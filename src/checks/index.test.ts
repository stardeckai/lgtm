import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CATEGORY_OF, CHECKS, EXPLANATIONS } from "./index.js";

const DIR = fileURLToPath(new URL(".", import.meta.url));
// One literal per category: Vite can only analyse a dynamic import with a single variable segment.
const IMPORTERS: Record<string, (base: string) => Promise<{ default: { id: string } }>> = {
  assertions: (base) => import(`./assertions/${base}.ts`),
  mocks: (base) => import(`./mocks/${base}.ts`),
  scope: (base) => import(`./scope/${base}.ts`),
  diff: (base) => import(`./diff/${base}.ts`),
};

/** The order users see in --list-checks, the README and the generated Claude skill. */
const ORDER = [
  "would-pass-if-broken",
  "vacuous-assertion",
  "assertion-weaker-than-name",
  "reimplements-logic",
  "mocks-seam-under-test",
  "mock-mirrors-implementation",
  "tests-calls-not-outcomes",
  "tests-internals",
  "setup-dominates",
  "broad-snapshot",
  "swallowed-error-as-success",
  "impossible-fixture",
  "happy-path-only-of-risky-boundary",
  "trivial-primitive",
  "over-mocked",
  "regression-does-not-distinguish",
  "changed-in-lockstep",
];

describe("CHECKS", () => {
  it("is the published list, in the published order", () => {
    expect(CHECKS.map((c) => c.id)).toEqual(ORDER);
  });

  it("names every check file after the id it exports, and registers all of them", async () => {
    const files = Object.keys(IMPORTERS).flatMap((cat) =>
      fs
        .readdirSync(path.join(DIR, cat))
        .filter((f) => f.endsWith(".ts"))
        .map((f) => ({ cat, base: f.replace(/\.ts$/, "") })),
    );
    for (const { cat, base } of files) {
      const mod = await IMPORTERS[cat]!(base);
      expect(mod.default.id, `${cat}/${base}.ts`).toBe(base);
    }
    expect(files.map((f) => f.base).sort()).toEqual([...ORDER].sort());
  });

  it("explains every check once, and nothing that is not a check", () => {
    expect(Object.keys(EXPLANATIONS).sort()).toEqual(CHECKS.map((c) => c.id).sort());
    for (const text of Object.values(EXPLANATIONS)) expect(text.length).toBeGreaterThan(80);
  });

  it("maps every check to the category directory its file lives in", () => {
    expect(Object.keys(CATEGORY_OF).sort()).toEqual(CHECKS.map((c) => c.id).sort());
    for (const [id, category] of Object.entries(CATEGORY_OF)) {
      expect(fs.existsSync(path.join(DIR, category, `${id}.ts`)), `${id} in ${category}/`).toBe(true);
    }
  });
});
