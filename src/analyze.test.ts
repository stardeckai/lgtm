import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Questions } from "@typesafe-ai/sdk";
import { analyze, buildStates, fitBudget, type Client, type Job, type State } from "./analyze.js";
import { CHECKS, type TestClass } from "./checks/index.js";

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
  it("reports answers at or above the threshold and nothing below it", async () => {
    const at = await analyze([job()], { only: ["vacuous-assertion"], threshold: 0.8 }, fakeClient(0.8).client);
    expect(at.findings).toEqual([
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

  it("sends diff-only checks only when the state has a diff", async () => {
    const diffOnly = CHECKS.filter((c) => c.diffOnly).map((c) => c.id);
    expect(diffOnly.length).toBeGreaterThan(0);

    const without = fakeClient(0);
    await analyze([job()], {}, without.client);
    expect(Object.keys(without.seen[0]!).filter((k) => k !== "test_class")).toEqual(
      CHECKS.filter((c) => !c.diffOnly).map((c) => c.id),
    );

    const withDiff = fakeClient(0);
    await analyze([job({ diff: "- old\n+ new" })], {}, withDiff.client);
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
    // A cache dir that is a file: the answer is billed, then the cache write throws. The caller still knows the cost.
    const cacheDir = path.join(tmp(), "not-a-dir");
    fs.writeFileSync(cacheDir, "");
    const spends: number[] = [];

    await expect(analyze([job()], { cacheDir, onSpend: (t) => spends.push(t) }, fakeClient(0.9).client)).rejects.toThrow();
    expect(spends).toEqual([42]);
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
  it("includes a module imported by two implementation modules exactly once", () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, "shared.ts"), "export const shared = 1;\n");
    fs.writeFileSync(path.join(dir, "a.ts"), 'import { shared } from "./shared.js";\nexport const a = shared;\n');
    fs.writeFileSync(path.join(dir, "b.ts"), 'import { shared } from "./shared.js";\nexport const b = shared;\n');
    fs.writeFileSync(
      path.join(dir, "a.test.ts"),
      [
        'import { a } from "./a.js";',
        'import { b } from "./b.js";',
        'it("adds", () => { expect(a + b).toBe(2); });',
      ].join("\n"),
    );

    const impl = buildStates([path.join(dir, "a.test.ts")], { impl: true })[0]!.state.implementation!;
    const header = `// ---- ${path.relative(process.cwd(), path.join(dir, "shared.ts"))}`;
    expect(impl.split(header).length - 1).toBe(1);
    expect(impl).toContain("export const shared = 1;");
    expect(impl).toContain("export const a = shared;");
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
    fs.writeFileSync(path.join(dir, "deep.ts"), "export const deep = 1;\n");
    fs.writeFileSync(
      path.join(dir, "impl.ts"),
      `import { deep } from "./deep.js";\nexport const pad = "${"y".repeat(20_000)}";\nexport const impl = deep;\n`,
    );
    const file = path.join(dir, "a.test.ts");
    fs.writeFileSync(file, 'import { impl } from "./impl.js";\nit("works", () => { expect(impl).toBe(1); });\n');

    const lean = buildStates([file], { impl: true, lean: true })[0]!.state;
    expect(lean.test_file).toBeUndefined();
    expect(lean.repo_guidelines).toBeUndefined();
    expect(lean.implementation!.length).toBeLessThanOrEqual(8_000 + "\n/* …truncated… */".length);
    expect(lean.implementation).not.toContain("deep.ts");

    const full = buildStates([file], { impl: true })[0]!.state;
    expect(full.test_file).toContain("// >>> test under evaluation");
    expect(full.repo_guidelines).toContain("Name the bug.");
    expect(full.implementation).toContain("export const deep = 1;");
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
