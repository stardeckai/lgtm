import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { blockTouched, buildStates, changedRanges, checksFor, defaultDiffBase, diffSelection, type GitRun, type State, normalizeDiffFlag } from "./analyze.js";
import { CHECKS } from "./checks/index.js";

describe("changedRanges", () => {
  it("maps every hunk header to its new-side lines, counting a pure deletion as its anchor line", () => {
    const hunks = [
      "diff --git a/src/a.test.ts b/src/a.test.ts",
      "--- a/src/a.test.ts",
      "+++ b/src/a.test.ts",
      "@@ -3 +3 @@ describe('a', () => {",
      "-  expect(x).toBeDefined();",
      "+  expect(x).toBe(1);",
      "@@ -7,3 +7,3 @@",
      " keep",
      "@@ -15,2 +17,0 @@ it('gone', () => {",
      "-  deleted();",
      "-  deleted();",
    ].join("\n");
    expect(changedRanges(hunks)).toEqual([
      [3, 3],
      [7, 9],
      [17, 17],
    ]);
  });
});

describe("blockTouched", () => {
  const block = { line: 10, endLine: 20 };
  it("counts a range that only shares an endpoint and ignores ranges outside the block", () => {
    expect(blockTouched(block, [[20, 25]])).toBe(true);
    expect(blockTouched(block, [[5, 10]])).toBe(true);
    expect(blockTouched(block, [[12, 13]])).toBe(true);
    expect(blockTouched(block, [[21, 30]])).toBe(false);
    expect(blockTouched(block, [[1, 9]])).toBe(false);
    expect(blockTouched(block, [])).toBe(false);
    expect(blockTouched(block, [[1, 9], [30, 40], [15, 15]])).toBe(true);
  });
});

describe("checksFor with a diff", () => {
  const diffOnly = CHECKS.filter((c) => c.diffOnly).map((c) => c.id);
  const state: State = {
    test_name: "t",
    describe_path: "",
    test_code: "it('t', () => {})",
    file_context: "",
    sibling_tests: "",
    diff: "@@ -1 +1 @@",
  };

  it("sends the diff-only checks to a changed block and every other check to an untouched one", () => {
    expect(diffOnly.length).toBeGreaterThan(0);
    const ofTouched = checksFor(state, {}, true).map((c) => c.id);
    const ofUntouched = checksFor(state, {}, false).map((c) => c.id);
    expect(diffOnly.every((id) => ofTouched.includes(id))).toBe(true);
    expect(ofUntouched.some((id) => diffOnly.includes(id))).toBe(false);
    expect(ofUntouched).toEqual(ofTouched.filter((id) => !diffOnly.includes(id)));
  });
});

describe("defaultDiffBase", () => {
  /** A git that succeeds only for the listed argument prefixes. */
  const fake = (ok: string[]): GitRun => (args) => {
    const line = args.join(" ");
    const hit = ok.find((o) => line.startsWith(o));
    if (!hit) throw new Error(`fatal: ${line}`);
    return hit === "symbolic-ref" ? "refs/remotes/origin/develop\n" : "abc123";
  };

  it("prefers origin's HEAD branch", () => {
    expect(defaultDiffBase(fake(["symbolic-ref", "rev-parse --verify --quiet origin/main"]))).toBe("origin/develop");
  });

  it("falls back to origin/main, then main, then master", () => {
    expect(defaultDiffBase(fake(["rev-parse --verify --quiet origin/main", "rev-parse --verify --quiet main"]))).toBe("origin/main");
    expect(defaultDiffBase(fake(["rev-parse --verify --quiet main"]))).toBe("main");
    expect(defaultDiffBase(fake(["rev-parse --verify --quiet master"]))).toBe("master");
    expect(() => defaultDiffBase(fake([]))).toThrow(/no default branch/);
  });
});

describe("diffSelection in a real repo", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  });

  /** git in `cwd`, with every inherited GIT_* variable (the pre-push hook's, mainly) stripped. */
  const gitIn = (cwd: string): GitRun => {
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("GIT_")));
    return (args) =>
      execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", ...args], {
        cwd,
        env,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
  };

  const write = (dir: string, name: string, body: string) => fs.writeFileSync(path.join(dir, name), body);
  const testFile = (imp: string, ...names: string[]) =>
    `import { f } from "${imp}";\n` +
    names.map((n) => `it("${n}", () => {\n  expect(f()).toBe("${n}");\n});\n`).join("\n");

  it("selects changed blocks, untracked files and the tests of changed implementation, and nothing else", () => {
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-diff-")));
    dirs.push(dir);
    const git = gitIn(dir);
    git(["init", "-b", "main"]);
    write(dir, "impl.ts", "export const f = () => 'one';\n");
    write(dir, "other.ts", "export const f = () => 'three';\n");
    write(dir, "quiet.ts", "export const f = () => 'four';\n");
    write(dir, "impl.test.ts", testFile("./impl", "one", "two"));
    write(dir, "other.test.ts", testFile("./other", "three"));
    write(dir, "quiet.test.ts", testFile("./quiet", "four"));
    git(["add", "-A"]);
    git(["commit", "-m", "base"]);

    // The work in progress: edit the second block of impl.test.ts, add a new test file, change other.ts.
    write(dir, "impl.test.ts", testFile("./impl", "one", "two changed"));
    write(dir, "new.test.ts", testFile("./impl", "five", "six"));
    write(dir, "other.ts", "export const f = () => 'three!';\n");

    const candidates = () => fs.readdirSync(dir).filter((f) => f.endsWith(".test.ts")).map((f) => path.join(dir, f));
    const selection = diffSelection(undefined, candidates, {}, git);
    expect(selection.label).toBe("main");
    expect(selection.base).toBe(git(["rev-parse", "HEAD"]));

    const jobs = buildStates(selection.files, {
      impl: false,
      blockFilter: selection.blockFilter,
      touched: selection.touched,
    });
    const picked = jobs.map((j) => `${path.basename(j.block.file)}:${j.block.name}`).sort();
    expect(picked).toEqual([
      "impl.test.ts:two changed", // only the block that moved; "one" is untouched
      "new.test.ts:five", // untracked file: every block
      "new.test.ts:six",
      "other.test.ts:three", // the test did not change but other.ts did
    ]);
    // quiet.test.ts is untouched and imports nothing that changed.
    expect(picked.some((p) => p.startsWith("quiet"))).toBe(false);

    // The diff-only checks are for blocks the diff touched; other.test.ts came along for its implementation.
    const touched = Object.fromEntries(jobs.map((j) => [`${path.basename(j.block.file)}:${j.block.name}`, j.touched]));
    expect(touched).toEqual({
      "impl.test.ts:two changed": true,
      "new.test.ts:five": true,
      "new.test.ts:six": true,
      "other.test.ts:three": false,
    });

    // An untracked file has no diff against the base, so it is shown as wholly added.
    const cwd = process.cwd();
    const saved = Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith("GIT_")));
    for (const k of Object.keys(saved)) delete process.env[k];
    process.chdir(dir);
    try {
      const withDiff = buildStates(selection.files, { impl: false, diffBase: selection.base, touched: selection.touched });
      const diffOf = (name: string) => withDiff.find((j) => j.block.name === name)!.state.diff ?? "";
      expect(diffOf("five")).toMatch(/\+\+\+ .*new\.test\.ts/);
      expect(diffOf("five")).toContain('"five"');
      expect(diffOf("two changed")).toMatch(/^-.*"two"/m);
    } finally {
      process.chdir(cwd);
      Object.assign(process.env, saved);
    }
  });

  it("keeps every block of a changed file with allBlocks", () => {
    const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-diff-")));
    dirs.push(dir);
    const git = gitIn(dir);
    git(["init", "-b", "main"]);
    write(dir, "impl.ts", "export const f = () => 'one';\n");
    write(dir, "impl.test.ts", testFile("./impl", "one", "two"));
    git(["add", "-A"]);
    git(["commit", "-m", "base"]);
    write(dir, "impl.test.ts", testFile("./impl", "one", "two changed"));

    const selection = diffSelection(undefined, () => [], { allBlocks: true }, git);
    expect(selection.blockFilter).toBeUndefined();
    const jobs = buildStates(selection.files, { impl: false, touched: selection.touched });
    // Both blocks are audited, but only the changed one is new enough for the diff-only checks.
    expect(jobs.map((j) => [j.block.name, j.touched])).toEqual([
      ["one", false],
      ["two changed", true],
    ]);
  });
});

describe("normalizeDiffFlag", () => {
  const exists = (p: string) => p === "src";

  it("treats --diff as bare when nothing, a flag or an existing path follows, and keeps a ref", () => {
    expect(normalizeDiffFlag(["--diff"], exists)).toEqual(["--diff="]);
    expect(normalizeDiffFlag(["--diff", "--yes"], exists)).toEqual(["--diff=", "--yes"]);
    // `lgtm --diff src` scopes to src against the default base; src must not be parsed as the ref.
    expect(normalizeDiffFlag(["--diff", "src"], exists)).toEqual(["--diff=", "src"]);
    expect(normalizeDiffFlag(["--diff", "origin/main", "src"], exists)).toEqual(["--diff", "origin/main", "src"]);
  });
});

describe("diffSelection refusals", () => {
  it("names an unknown ref instead of failing inside a later git call", () => {
    const run = (args: string[]) => {
      if (args[0] === "rev-parse" && args.includes("nope")) throw new Error("fatal: bad revision");
      throw new Error(`unexpected git ${args.join(" ")}`);
    };
    expect(() => diffSelection("nope", () => [], {}, run)).toThrow("--diff: unknown ref nope");
  });
});
