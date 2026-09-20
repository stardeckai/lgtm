import { describe, expect, it } from "vitest";
import { extractTests } from "./extract.js";

const source = `import { describe, it, expect, vi } from "vitest";
import { createUser } from "./user.js";

vi.mock("./mailer.js", () => ({ send: vi.fn() }));

const seed = { id: "u1" };

beforeEach(() => {
  seed.id = "u1";
});

describe("createUser", () => {
  it("creates the user", () => {
    expect(createUser(seed).id).toBe("u1");
  });

  it.each([[1], [2]])("handles %i", (n) => {
    expect(n).toBeGreaterThan(0);
  });
});

test.only("top level", async () => {
  const el = <div className="x">hi</div>;
  expect(el).toBeTruthy();
});
`;

describe("extractTests", () => {
  it("records every test with its name, line, describePath and exact source slice", () => {
    const { tests } = extractTests(source, "a.test.tsx");

    expect(tests.map((t) => [t.name, t.line, t.describePath])).toEqual([
      ["creates the user", 13, ["createUser"]],
      ["handles %i", 17, ["createUser"]],
      ["top level", 22, []],
    ]);
    expect(tests[0]!.code.startsWith("it(")).toBe(true);
    // for `.each` the slice and line are the OUTER call, so the table is included
    expect(tests[1]!.code.startsWith("it.each([[1], [2]])(")).toBe(true);
    expect(tests[1]!.code.endsWith("})")).toBe(true);
    expect(tests[2]!.code.startsWith("test.only(")).toBe(true);
    expect(tests[2]!.code).toContain('<div className="x">');
  });

  it("joins a template-literal name with a placeholder marker", () => {
    const { tests } = extractTests("it(`renders ${name} fast`, () => {});", "b.test.ts");
    expect(tests.map((t) => t.name)).toEqual(["renders ${…} fast"]);
  });

  it("puts imports, mocks, hooks and helpers in fileContext but no test bodies", () => {
    const { fileContext, imports } = extractTests(source, "a.test.tsx");

    expect(fileContext).toContain('import { createUser } from "./user.js";');
    expect(fileContext).toContain('vi.mock("./mailer.js"');
    expect(fileContext).toContain("beforeEach(() => {");
    expect(fileContext).toContain("const seed");
    expect(fileContext).not.toContain("creates the user");
    expect(fileContext).not.toContain("top level");
    expect(imports).toEqual(["vitest", "./user.js"]);
  });

  it("leaves type-only imports and re-exports out, and lists value re-exports separately", () => {
    const src = [
      'import type { A } from "./a.js";',
      'import { type B, type C } from "./b.js";',
      'import { type D, d } from "./d.js";',
      'import { e } from "./e.js";',
      'import "./setup.js";',
      'export * from "./f.js";',
      'export type { G } from "./g.js";',
      'export { type H } from "./h.js";',
      'it("works", () => { expect(d(e)).toBe(1); });',
    ].join("\n");
    const { imports, reexports } = extractTests(src, "a.test.ts");
    expect(imports).toEqual(["./d.js", "./e.js", "./setup.js"]);
    expect(reexports).toEqual(["./f.js"]);
  });
});
