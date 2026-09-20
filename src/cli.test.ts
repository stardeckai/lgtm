import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const cli = fileURLToPath(new URL("./cli.ts", import.meta.url));
const repo = path.dirname(path.dirname(cli));
const run = (...args: string[]) =>
  spawnSync("npx", ["tsx", cli, ...args], { cwd: repo, encoding: "utf8" });

describe("target", () => {
  it("refuses to scan the cwd when no path is given", () => {
    const { status, stdout } = run();
    expect(status).toBe(2);
    expect(stdout).toContain("lgtm <files|dirs...>");
    expect(stdout).not.toContain("will run on");
  });

  it("still plans a run for an explicit path", () => {
    const { status, stdout } = run("--dry-run", "src/ignore.test.ts");
    expect(status).toBe(0);
    expect(stdout).toContain("will run on");
  });

  // `--diff HEAD` needs no history (CI checks out shallow) and no changed files: reaching the
  // diff path at all is the point — the guard must not swallow a --diff run that has no positional.
  it("still plans a run for --diff with no path", () => {
    const { status, stdout, stderr } = run("--dry-run", "--diff", "HEAD");
    expect(status).toBe(0);
    expect(stdout).not.toContain("lgtm <files|dirs...>");
    // The plan (stdout) when the tree is dirty, "no test blocks found" (stderr) when it is clean.
    expect(stdout + stderr).toContain("changed vs HEAD");
  });
});
