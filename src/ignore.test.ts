import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ignoreMatcher } from "./ignore.js";

describe("ignoreMatcher", () => {
  it("reads .lgtmignore and --ignore patterns with gitignore semantics", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-ignore-"));
    fs.writeFileSync(path.join(cwd, ".lgtmignore"), "# fixtures\nevals/\n*.stories.test.ts\n");
    const ignored = ignoreMatcher(["**/fixtures/**", "legacy"], cwd);

    expect(ignored("evals/cases/x/case.test.ts")).toBe(true);
    expect(ignored("src/evals.test.ts")).toBe(false); // `evals/` is a directory pattern, not a prefix
    expect(ignored("src/button.stories.test.ts")).toBe(true);
    expect(ignored("src/button.test.ts")).toBe(false);
    expect(ignored("src/a/fixtures/b.test.ts")).toBe(true);
    expect(ignored("packages/legacy/x.test.ts")).toBe(true); // bare name matches at any depth
    expect(ignored("packages/legacy-v2/x.test.ts")).toBe(false);
  });
});
