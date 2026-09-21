/** Deterministic disk-cache replay. Run with `pnpm exec tsx scripts/cache-replay.ts`. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { analyze, buildStates, isCached, type AnalyzeOptions, type Client } from "../src/analyze.js";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cache-replay-"));
const testFile = path.join(root, "sample.test.ts");
const implFile = path.join(root, "impl.ts");
const source = `import { add } from "./impl.js";
const value = 1;
beforeEach(() => { void value; });
describe("addition", () => {
  it("adds one", () => { expect(add(value, 1)).toBe(2); });
  it("adds two", () => { expect(add(value, 2)).toBe(3); });
});
`;
const implementation = "export const add = (a: number, b: number) => a + b;\n";
const selected = ["vacuous-assertion", "reimplements-logic"];
const rows: { scenario: string; baselineRequests: number; hitsBefore: number; missesBefore: number; requests: number; estimatedInputChars: number }[] = [];

function clientFor(captured: { inputChars: number }[]): Client {
  return {
    async systemOne(request) {
      captured.push({ inputChars: JSON.stringify(request).length });
      return {
        model: "fake-replay",
        // Synthetic usage satisfies the client contract; the report uses captured request chars only.
        usage: { input_tokens: 0, output_tokens: 0 },
        answers: Object.fromEntries(Object.keys(request.questions).map((id) => [id,
          id === "test_class"
            ? { type: "choice" as const, choice: "pure_logic", confidence: 1, probabilities: {} }
            : { type: "noul" as const, noul: 0 },
        ])),
      };
    },
  };
}

async function replay(
  scenario: string,
  change?: () => void,
  only: string[] = selected,
): Promise<void> {
  fs.writeFileSync(testFile, source);
  fs.writeFileSync(implFile, implementation);
  const cacheDir = path.join(root, `cache-${rows.length}`);
  const opts: AnalyzeOptions = { cacheDir, only, concurrency: 1 };
  const baseline: { inputChars: number }[] = [];
  if (scenario !== "cold") {
    await analyze(buildStates([testFile], { impl: true }), { ...opts, only: selected }, clientFor(baseline));
  }
  change?.();
  const jobs = buildStates([testFile], { impl: true });
  const hitsBefore = jobs.filter((job) => isCached(job, opts)).length;
  const captured: { inputChars: number }[] = [];
  await analyze(jobs, opts, clientFor(captured));
  rows.push({
    scenario,
    baselineRequests: baseline.length,
    hitsBefore,
    missesBefore: jobs.length - hitsBefore,
    requests: captured.length,
    estimatedInputChars: captured.reduce((sum, request) => sum + request.inputChars, 0),
  });
}

try {
  await replay("cold");
  await replay("unchanged");
  await replay("edit sibling assertion", () => fs.writeFileSync(testFile, source.replace("toBe(3)", "toBe(4)")));
  await replay("insert blank lines", () => fs.writeFileSync(testFile, source.replace("describe(", "\n\ndescribe(")));
  await replay("shared hook change", () => fs.writeFileSync(testFile, source.replace("void value", "void (value + 1)")));
  await replay("imported implementation change", () => fs.writeFileSync(implFile, implementation.replace("a + b", "a - b")));
  await replay("narrower --only selection", undefined, selected.slice(0, 1));
  await replay("equivalent reversed --only", undefined, [...selected].reverse());
  console.log(JSON.stringify({ note: "Each non-cold scenario starts from a fresh cache warmed with the same two-check baseline. Input chars are serialized request estimates, not billed tokens or cost.", rows }, null, 2));
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
