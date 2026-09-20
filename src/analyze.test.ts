import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Questions } from "@typesafe-ai/sdk";
import { analyze, buildStates, type Client, type Job, type State } from "./analyze.js";
import { CHECKS, type TestClass } from "./checks.js";

const tmpDirs: string[] = [];
const tmp = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-test-"));
  tmpDirs.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of tmpDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

const state = (extra: Partial<State> = {}): State => ({
  test_name: "creates the user",
  describe_path: "createUser",
  test_code: 'it("creates the user", () => { expect(true).toBeDefined(); });',
  file_context: "",
  sibling_tests: "",
  ...extra,
});

const job = (extra: Partial<State> = {}): Job => ({
  block: { file: "a.test.ts", line: 3, name: "creates the user", describePath: [], code: "" },
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
    const at = await analyze([job()], { only: ["vacuous-assertion"] }, fakeClient(0.8).client);
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

    const below = await analyze([job()], { only: ["vacuous-assertion"] }, fakeClient(0.79).client);
    expect(below.findings).toEqual([]);

    const overridden = await analyze(
      [job()],
      { only: ["vacuous-assertion"], threshold: 0.7 },
      fakeClient(0.79).client,
    );
    expect(overridden.findings).toHaveLength(1);
  });

  it("reports 0.5-to-threshold answers only with verbose", async () => {
    const quiet = await analyze([job()], { only: ["vacuous-assertion"] }, fakeClient(0.6).client);
    expect(quiet.findings).toEqual([]);

    const verbose = await analyze([job()], { only: ["vacuous-assertion"], verbose: true }, fakeClient(0.6).client);
    expect(verbose.findings.map((f) => [f.probability, f.threshold])).toEqual([[0.6, 0.8]]);

    const tooLow = await analyze([job()], { only: ["vacuous-assertion"], verbose: true }, fakeClient(0.49).client);
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
