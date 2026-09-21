import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { analyze, buildStates, type Client } from "./analyze.js";

const cli = fileURLToPath(new URL("./cli.ts", import.meta.url));
const tsx = createRequire(import.meta.url).resolve("tsx");
const repo = path.dirname(path.dirname(cli));
const run = (...args: string[]) =>
  spawnSync(process.execPath, ["--import", "tsx", cli, ...args], { cwd: repo, encoding: "utf8" });

const tempDirs: string[] = [];
afterEach(() => { for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true }); });

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

  it("plans only misses from the validated disk cache", async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cli-cache-"));
    tempDirs.push(dir);
    fs.mkdirSync(path.join(dir, ".git"));
    fs.mkdirSync(path.join(dir, "node_modules"));
    const test = path.join(dir, "a.test.ts");
    fs.writeFileSync(test, 'it("works", () => { expect(1).toBe(1); });\n');
    const cacheDir = path.join(dir, "node_modules", ".cache", "lgtm");
    const client: Client = { async systemOne(request) {
      return { model: "fake", usage: { input_tokens: 42, output_tokens: 0 }, answers: Object.fromEntries(
        Object.keys(request.questions).map((id) => [id, id === "test_class"
          ? { type: "choice" as const, choice: "pure_logic" as const, confidence: 1, probabilities: {} }
          : { type: "noul" as const, noul: 0 }]),
      ) };
    } };
    await analyze(buildStates([test], { impl: true }), { cacheDir }, client);
    const plan = () => spawnSync(process.execPath, ["--import", tsx, cli, "--dry-run", test], { cwd: dir, encoding: "utf8" });
    expect(plan().stdout).toContain("1 already cached, 0 to send");
    const file = path.join(cacheDir, fs.readdirSync(cacheDir)[0]!);
    fs.writeFileSync(file, "{");
    expect(plan().stdout).not.toContain("already cached");
  });
});
