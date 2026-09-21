import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { APIError, AuthenticationError, TypeSafeClient, type Questions } from "@typesafe-ai/sdk";
import { analyze, buildStates, fitBudget, implFiles, isCached, type Client, type Job, type State } from "./analyze.js";
import { certain } from "./report.js";
import { CHECKS, TEST_CLASSES, type TestClass } from "./checks/index.js";

const tmpDirs: string[] = [];
const tmp = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-test-"));
  tmpDirs.push(dir);
  // Stop the guideline walk-up at the temp dir instead of the real machine.
  fs.mkdirSync(path.join(dir, ".git"));
  return dir;
};
afterEach(() => {
  for (const dir of tmpDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

const state = (extra: Partial<State> = {}): State => ({
  test_name: "creates the user",
  describe_path: "createUser",
  test_code: 'it("creates the user", () => { expect(createUser(seed).id).toBe("u1"); });',
  file_context: "",
  sibling_tests: "",
  ...extra,
});

const job = (extra: Partial<State> = {}): Job => ({
  block: { file: "a.test.ts", line: 3, name: "creates the user", describePath: [], code: "", endLine: 3 },
  state: state(extra),
});

/** Fake client answering every noul with `probability` and `test_class` with `testClass`. */
function fakeClient(probability: number, testClass: TestClass = "mocked_seam_unit") {
  const seen: Questions[] = [];
  const client: Client = {
    async systemOne(request) {
      seen.push(request.questions);
      return {
        model: "fake",
        usage: { input_tokens: 42, output_tokens: 1 },
        answers: Object.fromEntries(
          Object.keys(request.questions).map((id) => [
            id,
            id === "test_class"
              ? { type: "choice" as const, choice: testClass, confidence: 1, probabilities: {} }
              : { type: "noul" as const, noul: probability },
          ]),
        ),
      };
    },
  };
  return { client, seen };
}

describe("analyze", () => {
  it("flips the answer of an inverted check, so a confident 'the break is caught' scores low", async () => {
    // would-pass-if-broken asks whether the test would go red; a 0.2 there means 0.8 of smell
    const result = await analyze([job()], { only: ["would-pass-if-broken"], threshold: 0.5 }, fakeClient(0.2).client);
    expect(result.findings.map((f) => [f.checkId, f.probability])).toEqual([["would-pass-if-broken", 0.8]]);
    const sound = await analyze([job()], { only: ["would-pass-if-broken"], threshold: 0.5 }, fakeClient(0.9).client);
    expect(sound.findings).toEqual([]);
  });

  it("drops a check's pinned high line under --threshold, so --fail follows the override", async () => {
    // vacuous-assertion pins high at 0.75; with --threshold 0.9 a 0.8 is a --verbose suspect, not a certain finding
    const at = await analyze([job()], { only: ["vacuous-assertion"], threshold: 0.9, verbose: true }, fakeClient(0.8).client);
    expect(at.findings).toMatchObject([{ checkId: "vacuous-assertion", probability: 0.8, threshold: 0.9 }]);
    expect(at.findings[0]!.high).toBeUndefined();
    expect(at.findings.some(certain)).toBe(false);
    const own = await analyze([job()], { only: ["vacuous-assertion"] }, fakeClient(0.8).client);
    expect(own.findings[0]!.high).toBe(0.75);
  });

  it("reports answers at or above the threshold and nothing below it", async () => {
    const at = await analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, fakeClient(0.8).client);
    // toMatchObject: the finding also carries the check's own high line when it has one
    expect(at.findings).toMatchObject([
      {
        file: "a.test.ts",
        line: 3,
        name: "creates the user",
        checkId: "vacuous-assertion",
        probability: 0.8,
        threshold: 0.8,
      },
    ]);
    expect(at.inputTokens).toBe(42);

    const below = await analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, fakeClient(0.79).client);
    expect(below.findings).toEqual([]);

    const overridden = await analyze(
      [job()],
      { only: ["vacuous-assertion"], threshold: 0.7 },
      fakeClient(0.79).client,
    );
    expect(overridden.findings).toHaveLength(1);
  });

  it("reports 0.5-to-threshold answers only with verbose", async () => {
    const quiet = await analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, fakeClient(0.6).client);
    expect(quiet.findings).toEqual([]);

    const verbose = await analyze([job()], { only: ["vacuous-assertion"], verbose: true, threshold: 0.8 }, fakeClient(0.6).client);
    expect(verbose.findings.map((f) => [f.probability, f.threshold])).toEqual([[0.6, 0.8]]);

    const tooLow = await analyze([job()], { only: ["vacuous-assertion"], verbose: true, threshold: 0.8 }, fakeClient(0.49).client);
    expect(tooLow.findings).toEqual([]);
  });

  it("leaves opt-in checks out unless --only names them or the runner asks for them", async () => {
    const optIn = CHECKS.filter((c) => c.optIn).map((c) => c.id);
    expect(optIn).toContain("changed-in-lockstep");
    const byDefault = fakeClient(0);
    await analyze([job({ diff: "- old\n+ new" })], {}, byDefault.client);
    for (const id of optIn) expect(Object.keys(byDefault.seen[0]!)).not.toContain(id);
    const named = fakeClient(0);
    await analyze([job({ diff: "- old\n+ new" })], { only: ["changed-in-lockstep"] }, named.client);
    expect(Object.keys(named.seen[0]!).filter((k) => k !== "test_class")).toEqual(["changed-in-lockstep"]);
  });

  it("sends diff-only checks only when the state has a diff", async () => {
    const diffOnly = CHECKS.filter((c) => c.diffOnly).map((c) => c.id);
    expect(diffOnly.length).toBeGreaterThan(0);

    const without = fakeClient(0);
    await analyze([job()], { optIn: true }, without.client);
    expect(Object.keys(without.seen[0]!).filter((k) => k !== "test_class")).toEqual(
      CHECKS.filter((c) => !c.diffOnly).map((c) => c.id),
    );

    const withDiff = fakeClient(0);
    await analyze([job({ diff: "- old\n+ new" })], { optIn: true }, withDiff.client);
    expect(Object.keys(withDiff.seen[0]!).filter((k) => k !== "test_class")).toEqual(CHECKS.map((c) => c.id));
  });

  it("asks for the test class as a choice and returns the answer", async () => {
    const fake = fakeClient(0, "contract_integration");
    const result = await analyze([job()], {}, fake.client);

    expect(fake.seen[0]!.test_class).toMatchObject({
      type: "choice",
      criteria: { pure_logic: expect.any(String), mocked_seam_unit: expect.any(String), contract_integration: expect.any(String) },
    });
    expect(result.classes).toEqual([
      { file: "a.test.ts", line: 3, name: "creates the user", testClass: "contract_integration" },
    ]);
  });

  it("reports spend the moment a request is billed, so a later throw does not lose it", async () => {
    // Storage becomes unwritable while the request is in flight; the caller still knows the billed cost.
    const cacheDir = path.join(tmp(), "not-a-dir");
    const spends: number[] = [];
    const fake = fakeClient(0.9);
    const client: Client = { async systemOne(request) {
      const result = await fake.client.systemOne(request);
      fs.writeFileSync(cacheDir, "");
      return result;
    } };

    await expect(analyze([job()], { cacheDir, onSpend: (t) => spends.push(t) }, client)).rejects.toThrow();
    expect(spends).toEqual([42]);
  });

  it("waits for in-flight requests to bill before it throws, so no spend lands after the caller gave up", async () => {
    // One request fails fast while a slower sibling is still in flight: the slow one bills, and its tokens must
    // be known before analyze rejects — the caller records spend once, on the way out.
    const spends: number[] = [];
    let call = 0;
    const client: Client = {
      async systemOne(request) {
        if (++call === 1) throw new Error("boom");
        await new Promise((r) => setTimeout(r, 30));
        return {
          model: "fake",
          usage: { input_tokens: 42, output_tokens: 1 },
          answers: Object.fromEntries(Object.keys(request.questions).map((id) => [id, { type: "noul" as const, noul: 0 }])),
        };
      },
    };

    await expect(
      analyze([job(), job({ test_code: "it('other', () => {})" })], { concurrency: 2, onSpend: (t) => spends.push(t) }, client),
    ).rejects.toThrow("boom");

    expect(spends).toEqual([42]);           // billed before the rejection, not after it
    await new Promise((r) => setTimeout(r, 60));
    expect(spends).toEqual([42]);           // and nothing bills once the caller has moved on
  });

  it("answers a repeated state from the cache instead of calling the API again", async () => {
    const cacheDir = tmp();
    const first = fakeClient(0.9);
    const firstRun = await analyze([job()], { cacheDir }, first.client);
    expect(first.seen).toHaveLength(1);

    const second = fakeClient(0.9);
    const secondRun = await analyze([job()], { cacheDir }, second.client);
    expect(second.seen).toHaveLength(0);
    expect(secondRun.findings).toEqual(firstRun.findings);
  });

  it("stops before billing when cache storage cannot be read", async () => {
    const cacheDir = tmp();
    const opts = { cacheDir, only: ["vacuous-assertion"] };
    await analyze([job()], opts, fakeClient(0).client);
    const file = path.join(cacheDir, fs.readdirSync(cacheDir).find((name) => name.endsWith(".json"))!);
    fs.unlinkSync(file);
    fs.mkdirSync(file); // Real I/O failure, distinct from a missing entry or malformed JSON.
    expect(() => isCached(job(), opts)).toThrow();
    const next = fakeClient(0);
    const spends: number[] = [];
    await expect(analyze([job()], { ...opts, onSpend: (n) => spends.push(n) }, next.client)).rejects.toThrow();
    expect(next.seen).toHaveLength(0);
    expect(spends).toEqual([]);
  });

  it("keys the same ordered request body sent by the SDK", async () => {
    const bodies: unknown[] = [];
    const client = new TypeSafeClient({ apiKey: "fake", defaultModel: "different-default", fetch: async (_url, init) => {
      bodies.push(JSON.parse(String(init?.body)));
      const questions = (bodies.at(-1) as { questions: Questions }).questions;
      return new Response(JSON.stringify({ model: "fake", usage: { input_tokens: 1, output_tokens: 0 }, answers: Object.fromEntries(
        Object.keys(questions).map((id) => [id, id === "test_class"
          ? { type: "choice", choice: "pure_logic", confidence: 1, probabilities: {} }
          : { type: "noul", noul: 0 }]),
      ) }), { status: 200, headers: { "content-type": "application/json" } });
    } });
    const opts = { cacheDir: tmp(), only: ["setup-dominates", "vacuous-assertion"] };
    await analyze([job()], opts, client);
    expect(bodies).toHaveLength(1);
    expect(Object.keys((bodies[0] as { questions: Questions }).questions)).toEqual([
      "test_class", "vacuous-assertion", "setup-dominates",
    ]);
    expect((bodies[0] as { model: string }).model).toBe("jev-latest");
    await analyze([job()], { ...opts, only: [...opts.only].reverse() }, client);
    expect(bodies).toHaveLength(1);
    const original = Object.entries(TEST_CLASSES);
    const choices = TEST_CLASSES as Record<string, string>;
    try {
      for (const key of Object.keys(choices)) delete choices[key];
      Object.assign(choices, Object.fromEntries([...original].reverse()));
      expect(isCached(job(), opts)).toBe(false);
      await analyze([job()], opts, client);
      expect(bodies).toHaveLength(2);
      const sent = bodies[1] as { questions: { test_class: { criteria: Record<string, string> } } };
      expect(Object.keys(sent.questions.test_class.criteria)).toEqual(original.map(([key]) => key).reverse());
    } finally {
      for (const key of Object.keys(choices)) delete choices[key];
      Object.assign(choices, Object.fromEntries(original));
    }
  });

  it("reuses only complete answers for the exact ordered request and evidence", async () => {
    const dir = tmp();
    const cacheDir = path.join(dir, "cache");
    const test = path.join(dir, "unit.test.ts");
    const impl = path.join(dir, "unit.ts");
    fs.writeFileSync(impl, "export const value = () => 1;\n");
    fs.writeFileSync(test, 'import { value } from "./unit";\nit("works", () => { expect(value()).toBe(1); });\n');
    const jobs = () => buildStates([test], { impl: true });
    const options = { cacheDir, only: ["vacuous-assertion", "setup-dominates"], threshold: 0.95 };
    const first = fakeClient(0.8);
    const initial = await analyze(jobs(), options, first.client);
    expect(first.seen).toHaveLength(1);
    expect(initial.findings).toEqual([]);
    expect(isCached(jobs()[0]!, options)).toBe(true);
    const reused = fakeClient(0);
    const changedThreshold = await analyze(jobs(), { ...options, only: [...options.only].reverse(), threshold: 0.7 }, reused.client);
    expect(reused.seen).toHaveLength(0);
    expect(changedThreshold.findings).toHaveLength(2);
    expect(changedThreshold.model).toBe("fake");

    const changedSelection = { ...options, only: ["vacuous-assertion"] };
    expect(isCached(jobs()[0]!, changedSelection)).toBe(false);
    const selected = fakeClient(0);
    await analyze(jobs(), changedSelection, selected.client);
    expect(selected.seen).toHaveLength(1);

    fs.writeFileSync(impl, "export const value = () => 2;\n");
    expect(isCached(jobs()[0]!, options)).toBe(false);
    const changedEvidence = fakeClient(0);
    await analyze(jobs(), options, changedEvidence.client);
    expect(changedEvidence.seen).toHaveLength(1);

    const cacheFile = fs.readdirSync(cacheDir).find((name) => name.endsWith(".json") &&
      JSON.parse(fs.readFileSync(path.join(cacheDir, name), "utf8")).answers["setup-dominates"]?.noul === 0);
    expect(cacheFile).toBeDefined();
    const good = JSON.parse(fs.readFileSync(path.join(cacheDir, cacheFile!), "utf8"));
    // Corruption is a miss for planning and execution alike.
    for (const bad of [
      "{",
      JSON.stringify({ model: "fake", answers: { test_class: { type: "choice", choice: "pure_logic" } } }),
      JSON.stringify({ ...good, answers: { ...good.answers, test_class: { type: "choice", choice: "unknown" } } }),
      JSON.stringify({ ...good, answers: { ...good.answers, "setup-dominates": { type: "noul", noul: 2 } } }),
      JSON.stringify({ ...good, answers: { ...good.answers, "setup-dominates": { type: "noul", noul: "NaN" } } }),
    ]) {
      fs.writeFileSync(path.join(cacheDir, cacheFile!), bad);
      expect(isCached(jobs()[0]!, options)).toBe(false);
      const replacement = fakeClient(0.8);
      await analyze(jobs(), options, replacement.client);
      expect(replacement.seen).toHaveLength(1);
    }
  });

  it("invalidates an access test when another suite's refusal coverage changes", async () => {
    const dir = tmp();
    const test = path.join(dir, "access.test.ts");
    const cacheDir = path.join(dir, "cache");
    const source = (refusal: string) => `describe("access", () => { it("allows", () => { expect(true).toBe(true); }); });\n` +
      `describe("refusal", () => { it("denies", () => { ${refusal} }); });\n`;
    fs.writeFileSync(test, source("expect(false).toBe(false);"));
    const access = () => buildStates([test], { impl: true })[0]!;
    const options = { cacheDir, only: ["happy-path-only-of-risky-boundary"] };
    await analyze([access()], options, fakeClient(0).client);
    expect(isCached(access(), options)).toBe(true);
    fs.writeFileSync(test, source("expect(false).toBe(true);"));
    expect(isCached(access(), options)).toBe(false);
  });
});

describe("buildStates", () => {
  it("resolves a .js specifier to its .ts source and lists the other tests in the file", () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, "foo.ts"), "export const foo = () => 1;\n");
    fs.writeFileSync(
      path.join(dir, "a.test.ts"),
      [
        'import { foo } from "./foo.js";',
        'describe("foo", () => {',
        '  it("returns one", () => { expect(foo()).toBe(1); });',
        '  it("is a function", () => { expect(typeof foo).toBe("function"); });',
        "});",
      ].join("\n"),
    );

    const jobs = buildStates([path.join(dir, "a.test.ts")], { impl: true });

    expect(jobs.map((j) => j.state.test_name)).toEqual(["returns one", "is a function"]);
    expect(jobs[0]!.state.implementation).toContain(
      `// ---- ${path.relative(process.cwd(), path.join(dir, "foo.ts"))}`,
    );
    expect(jobs[0]!.state.implementation).not.toContain("// ---- /");
    expect(jobs[0]!.state.implementation).toContain("export const foo = () => 1;");
    expect(jobs[0]!.state.sibling_tests).toBe("4: foo > is a function");
    expect(jobs[0]!.state.describe_path).toBe("foo");
  });
});

describe("buildStates context", () => {
  it("sends the value imports and what a barrel forwards: no transitive hop, no type-only modules", () => {
    const dir = tmp();
    fs.mkdirSync(path.join(dir, "lib"));
    fs.writeFileSync(path.join(dir, "lib", "c.ts"), 'import { shared } from "../shared.js";\nexport const c = shared;\n');
    fs.writeFileSync(path.join(dir, "lib", "index.ts"), 'export * from "./c.js";\nexport type { Pair } from "../types.js";\n');
    fs.writeFileSync(path.join(dir, "shared.ts"), "export const shared = 1;\n");
    fs.writeFileSync(path.join(dir, "a.ts"), 'import { shared } from "./shared.js";\nexport const a = shared;\n');
    fs.writeFileSync(path.join(dir, "b.ts"), 'import { shared } from "./shared.js";\nexport const b = shared;\n');
    fs.writeFileSync(path.join(dir, "types.ts"), "export type Pair = [number, number];\n");
    fs.writeFileSync(path.join(dir, "setup.ts"), "globalThis.ready = true;\n");
    fs.writeFileSync(
      path.join(dir, "a.test.ts"),
      [
        'import "./setup.js";',
        'import { a } from "./a.js";',
        'import { type Pair, b } from "./b.js";',
        'import type { Pair as P2 } from "./types.js";',
        'import { c } from "./lib/index.js";',
        'it("adds", () => { expect(a + b + c).toBe(3); });',
      ].join("\n"),
    );

    const impl = buildStates([path.join(dir, "a.test.ts")], { impl: true })[0]!.state.implementation!;
    const files = impl.split("\n").filter((l) => l.startsWith("// ---- ")).map((l) => path.basename(l));
    expect(files).toEqual(["setup.ts", "a.ts", "b.ts", "index.ts", "c.ts"]);
    // the same list decides --diff selection, so a change behind the barrel reaches this test
    expect(implFiles(path.join(dir, "a.test.ts"), ["./lib/index.js"])).toEqual([path.join(dir, "lib", "index.ts"), path.join(dir, "lib", "c.ts")]);
    expect(impl).toContain("export const a = shared;");
    expect(impl).not.toContain("export const shared = 1;");
  });

  it("fences the second block of a two-test file in test_file", () => {
    const dir = tmp();
    const file = path.join(dir, "two.test.ts");
    fs.writeFileSync(
      file,
      [
        'it("first", () => {',
        "  expect(1).toBe(1);",
        "});",
        'it("second", () => {',
        "  expect(2).toBe(2);",
        "});",
      ].join("\n"),
    );

    const jobs = buildStates([file], { impl: false });
    expect(jobs.map((j) => j.state.test_name)).toEqual(["first", "second"]);
    expect(jobs[1]!.state.test_file!.split("\n")).toEqual([
      'it("first", () => {',
      "  expect(1).toBe(1);",
      "});",
      "// >>> test under evaluation",
      'it("second", () => {',
      "  expect(2).toBe(2);",
      "});",
      "// <<< end",
    ]);
  });

  it("takes only the test sections of a CLAUDE.md at the git root", () => {
    const dir = tmp();
    fs.writeFileSync(
      path.join(dir, "CLAUDE.md"),
      [
        "# Project",
        "",
        "## Styling",
        "Never use shadows.",
        "",
        "## Testing",
        "Every test must name the bug it prevents.",
        "",
        "### Mocks",
        "Do not mock the seam under test.",
        "",
        "### Naming",
        "Use verbs.",
        "",
        "## Database",
        "Use Drizzle.",
      ].join("\n"),
    );
    const file = path.join(dir, "a.test.ts");
    fs.writeFileSync(file, 'it("works", () => { expect(1).toBe(1); });\n');

    const guidelines = buildStates([file], { impl: false })[0]!.state.repo_guidelines!;
    expect(guidelines).toContain("Every test must name the bug it prevents.");
    expect(guidelines).toContain("Do not mock the seam under test.");
    // A nested test heading must not end the enclosing "## Testing" section.
    expect(guidelines).toContain("Use verbs.");
    expect(guidelines).not.toContain("Never use shadows.");
    expect(guidelines).not.toContain("Use Drizzle.");
  });
});

describe("fitBudget", () => {
  const big = (n: number) => "x".repeat(n);

  it("eats guidelines and the test file before the implementation, never the test code", () => {
    const testCode = big(20_000);
    const s = state({
      test_code: testCode,
      file_context: big(5_000),
      implementation: big(50_000),
      test_file: big(40_000),
      repo_guidelines: big(8_000),
    });

    const trims = fitBudget(s);

    expect(s.test_code).toBe(testCode);
    expect(s.repo_guidelines).toBeUndefined();
    expect(s.implementation).toBe(big(50_000));
    expect(s.file_context).toBe(big(5_000));
    expect(s.test_file!.endsWith("/* …truncated… */")).toBe(true);
    expect(s.test_file!.length).toBeLessThan(40_000);
    expect(trims.map((t) => t.field)).toEqual(["repo_guidelines", "test_file"]);
    expect(JSON.stringify(s).length).toBeLessThanOrEqual(100_000);
  });

  it("cuts into the implementation when the lower-priority fields are not enough", () => {
    const testCode = big(20_000);
    const s = state({
      test_code: testCode,
      file_context: big(5_000),
      implementation: big(90_000),
      test_file: big(40_000),
      repo_guidelines: big(8_000),
      diff: big(20_000),
    });

    const trims = fitBudget(s);

    expect(s.test_code).toBe(testCode);
    expect(s.diff).toBeUndefined();
    expect(s.repo_guidelines).toBeUndefined();
    expect(s.test_file).toBeUndefined();
    expect(s.implementation!.endsWith("/* …truncated… */")).toBe(true);
    expect(s.file_context).toBe(big(5_000));
    expect(trims.map((t) => t.field)).toEqual(["diff", "repo_guidelines", "test_file", "implementation"]);
    expect(JSON.stringify(s).length).toBeLessThanOrEqual(100_000);
  });

  it("leaves a state that already fits alone", () => {
    const s = state({ implementation: "small", test_file: "also small" });
    expect(fitBudget(s)).toEqual([]);
    expect(s.implementation).toBe("small");
  });
});

describe("--lean caps", () => {
  it("drops the test file and guidelines and caps the implementation at 8k", () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, "CLAUDE.md"), "## Testing\nName the bug.\n");
    fs.writeFileSync(
      path.join(dir, "impl.ts"),
      `export const pad = "${"y".repeat(20_000)}";\nexport const impl = 1;\n`,
    );
    const file = path.join(dir, "a.test.ts");
    fs.writeFileSync(file, 'import { impl } from "./impl.js";\nit("works", () => { expect(impl).toBe(1); });\n');

    const lean = buildStates([file], { impl: true, lean: true })[0]!.state;
    expect(lean.test_file).toBeUndefined();
    expect(lean.repo_guidelines).toBeUndefined();
    expect(lean.implementation!.length).toBeLessThanOrEqual(8_000 + "\n/* …truncated… */".length);

    const full = buildStates([file], { impl: true })[0]!.state;
    expect(full.test_file).toContain("// >>> test under evaluation");
    expect(full.repo_guidelines).toContain("Name the bug.");
    expect(full.implementation!.endsWith("/* …truncated… */")).toBe(false);
  });
});

describe("buildStates path aliases", () => {
  const testFile = (dir: string, spec: string) => {
    fs.writeFileSync(
      path.join(dir, "a.test.ts"),
      [`import { x } from "${spec}";`, 'it("works", () => { expect(x).toBe(1); });'].join("\n"),
    );
    return path.join(dir, "a.test.ts");
  };

  it("resolves a tsconfig `paths` alias against baseUrl", () => {
    const dir = tmp();
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
    );
    fs.mkdirSync(path.join(dir, "src", "lib"), { recursive: true });
    fs.writeFileSync(path.join(dir, "src", "lib", "x.ts"), "export const x = 1;\n");

    const impl = buildStates([testFile(dir, "@/lib/x")], { impl: true })[0]!.state.implementation!;

    expect(impl).toContain(`// ---- ${path.relative(process.cwd(), path.join(dir, "src", "lib", "x.ts"))}`);
    expect(impl).toContain("export const x = 1;");
  });

  it("inherits `paths` from an extended base config one directory up", () => {
    const dir = tmp();
    fs.writeFileSync(
      path.join(dir, "tsconfig.base.json"),
      JSON.stringify({ compilerOptions: { baseUrl: "./packages/app", paths: { "~/*": ["./lib/*"] } } }),
    );
    const app = path.join(dir, "packages", "app");
    fs.mkdirSync(path.join(app, "lib"), { recursive: true });
    fs.writeFileSync(path.join(app, "tsconfig.json"), JSON.stringify({ extends: "../../tsconfig.base.json" }));
    fs.writeFileSync(path.join(app, "lib", "x.ts"), "export const x = 1;\n");

    const impl = buildStates([testFile(app, "~/x")], { impl: true })[0]!.state.implementation!;

    expect(impl).toContain(`// ---- ${path.relative(process.cwd(), path.join(app, "lib", "x.ts"))}`);
    expect(impl).toContain("export const x = 1;");
  });

  it("parses a tsconfig with comments, a URL-valued key and a trailing comma", () => {
    const dir = tmp();
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      [
        "{",
        '  "$schema": "https://json.schemastore.org/tsconfig", // schema, not a comment',
        "  /* module aliases */",
        '  "compilerOptions": {',
        '    "paths": { "@/*": ["./src/*"], },',
        "  },",
        "}",
      ].join("\n"),
    );
    fs.mkdirSync(path.join(dir, "src"), { recursive: true });
    fs.writeFileSync(path.join(dir, "src", "x.ts"), "export const x = 1;\n");

    const impl = buildStates([testFile(dir, "@/x")], { impl: true })[0]!.state.implementation!;

    expect(impl).toContain(`// ---- ${path.relative(process.cwd(), path.join(dir, "src", "x.ts"))}`);
  });

  it("skips a bare package specifier that matches no alias", () => {
    const dir = tmp();
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    );
    fs.mkdirSync(path.join(dir, "react"), { recursive: true });
    fs.writeFileSync(path.join(dir, "react", "index.ts"), "export const x = 1;\n");

    expect(buildStates([testFile(dir, "react")], { impl: true })[0]!.state.implementation).toBeUndefined();
  });
});

describe("analyze API errors", () => {
  /** A client that fails `failures` times with the given error before answering like fakeClient(0.9). */
  function flakyClient(failures: number, error: Error) {
    const good = fakeClient(0.9);
    let calls = 0;
    const client: Client = {
      async systemOne(request) {
        calls += 1;
        if (calls <= failures) throw error;
        return good.client.systemOne(request);
      },
    };
    return { client, calls: () => calls };
  }
  const rateLimited = () => new APIError(429, { error: "Rate limit exceeded" }, new Headers(), "429 Rate limit exceeded");

  it("retries a 429 with backoff and reports the eventual answer as if it never failed", async () => {
    vi.useFakeTimers();
    try {
      const flaky = flakyClient(2, rateLimited());
      const pending = analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, flaky.client);
      await vi.runAllTimersAsync();
      const result = await pending;
      expect(flaky.calls()).toBe(3);
      expect(result.skipped).toBe(0);
      expect(result.findings.map((f) => [f.checkId, f.probability])).toEqual([["vacuous-assertion", 0.9]]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("gives up on a 429 after four attempts and counts the block as skipped, not as clean", async () => {
    vi.useFakeTimers();
    try {
      const flaky = flakyClient(99, rateLimited());
      const pending = analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, flaky.client);
      await vi.runAllTimersAsync();
      const result = await pending;
      expect(flaky.calls()).toBe(4);
      expect(result.skipped).toBe(1);
      expect(result.findings).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not retry other API errors and rethrows an authentication error", async () => {
    const server = flakyClient(99, new APIError(500, {}, new Headers(), "500 boom"));
    const result = await analyze([job()], { only: ["vacuous-assertion"] }, server.client);
    expect(server.calls()).toBe(1);
    expect(result.skipped).toBe(1);

    const auth = flakyClient(99, new AuthenticationError(401, {}, new Headers(), "401 bad key"));
    await expect(analyze([job()], { only: ["vacuous-assertion"] }, auth.client)).rejects.toBeInstanceOf(AuthenticationError);
    expect(auth.calls()).toBe(1);
  });
});
