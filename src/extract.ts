import { parse } from "@babel/parser";

export type TestBlock = {
  file: string;
  line: number;
  name: string;
  describePath: string[];
  /** exact source slice of the whole it(...) call */
  code: string;
  /** last line of the it(...) call, 1-based and inclusive */
  endLine: number;
};

export type Extracted = {
  tests: TestBlock[];
  /** imports, mocks, hooks and top-level helpers of the file, capped */
  fileContext: string;
  /** value import specifiers (relative or aliased), for resolving implementation source */
  imports: string[];
  /** `export … from` specifiers: what a barrel forwards, followed so a test that imports an index reaches the module */
  reexports: string[];
};

export const CONTEXT_CAP = 16000;

/** `it`, `it.only`, `it.skip.each` -> "it"; anything not rooted at an identifier -> null. */
function rootName(node: any): string | null {
  let n = node;
  while (n && n.type === "MemberExpression") n = n.object;
  return n && n.type === "Identifier" ? n.name : null;
}

/** The identifier a call is rooted at, seeing through `it.each(table)(name, fn)`. */
function callRoot(node: any): string | null {
  if (!node || node.type !== "CallExpression") return null;
  const callee = node.callee;
  return callee.type === "CallExpression" ? callRoot(callee) : rootName(callee);
}

function nameOf(arg: any): string | null {
  if (!arg) return null;
  if (arg.type === "StringLiteral") return arg.value;
  if (arg.type === "TemplateLiteral") return arg.quasis.map((q: any) => q.value.raw).join("${…}");
  return null;
}

export function extractTests(source: string, filePath: string): Extracted {
  let ast;
  try {
    ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"], errorRecovery: true });
  } catch (err) {
    console.warn(`[lgtm] could not parse ${filePath}: ${(err as Error).message}`);
    return { tests: [], fileContext: "", imports: [], reexports: [] };
  }

  const tests: TestBlock[] = [];
  const describePath: string[] = [];

  const visit = (node: any) => {
    const root = callRoot(node);
    const name = root ? nameOf(node.arguments?.[0]) : null;
    if (root === "describe" && name !== null) {
      describePath.push(name);
      children(node);
      describePath.pop();
      return;
    }
    if ((root === "it" || root === "test") && name !== null) {
      tests.push({
        file: filePath,
        line: node.loc.start.line,
        name,
        describePath: [...describePath],
        code: source.slice(node.start, node.end),
        endLine: node.loc.end.line,
      });
      return;
    }
    children(node);
  };

  const children = (node: any) => {
    for (const key of Object.keys(node)) descend(node[key]);
  };

  const descend = (value: any) => {
    if (Array.isArray(value)) value.forEach(descend);
    else if (value && typeof value === "object" && typeof value.type === "string") visit(value);
  };

  children(ast.program);

  const contextSlices: string[] = [];
  const imports: string[] = [];
  const reexports: string[] = [];
  // A type-only import or re-export is erased at runtime; the test cannot exercise that file, so it is not implementation.
  const typeOnly = (stmt: any, kind: "importKind" | "exportKind") =>
    stmt[kind] === "type" || (stmt.specifiers?.length > 0 && stmt.specifiers.every((sp: any) => sp[kind] === "type"));
  for (const stmt of ast.program.body as any[]) {
    let keep = false;
    if (stmt.type === "ImportDeclaration") {
      keep = true;
      if (!typeOnly(stmt, "importKind")) imports.push(stmt.source.value);
    } else if (typeof stmt.source?.value === "string") {
      // `export * from "./x"` / `export { a } from "./x"`
      if (!typeOnly(stmt, "exportKind")) reexports.push(stmt.source.value);
    } else if (stmt.type === "FunctionDeclaration") {
      keep = true;
    } else if (stmt.type === "VariableDeclaration" && stmt.kind === "const") {
      keep = true;
    } else if (stmt.type === "ExpressionStatement") {
      const root = callRoot(stmt.expression);
      const text = source.slice(stmt.start, stmt.end);
      keep =
        (root === "vi" || root === "jest" ? /^(vi|jest)\.mock\b/.test(text) : false) ||
        ["beforeEach", "beforeAll", "afterEach", "afterAll"].includes(root ?? "");
    }
    if (keep) contextSlices.push(source.slice(stmt.start, stmt.end));
  }

  let fileContext = contextSlices.join("\n");
  if (fileContext.length > CONTEXT_CAP) {
    fileContext = fileContext.slice(0, CONTEXT_CAP) + "\n/* …truncated… */";
  }

  return { tests, fileContext, imports, reexports };
}
