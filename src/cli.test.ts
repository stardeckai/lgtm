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

  it("includes the questions in the estimated input cost", () => {
    const plan = run("--dry-run", "--no-cache", "src/ignore.test.ts");
    const states = run("--dry-run", "--json", "src/ignore.test.ts");
    expect(plan.status).toBe(0);
    expect(states.status).toBe(0);
    const estimated = Number(plan.stdout.match(/~(\d+) input tokens/)?.[1]);
    const stateOnly = JSON.parse(states.stdout).reduce((n: number, job: { state: unknown }) => n + JSON.stringify(job.state).length, 0) / 4;
    expect(estimated).toBeGreaterThan(stateOnly + 1_000);
  });

  it("initializes the requested provider even when another provider has an environment key", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cli-init-"));
    tempDirs.push(home);
    const env = { ...process.env, HOME: home, TYPESAFE_API_KEY: "typesafe-env-key", AI_GATEWAY_API_KEY: "", OPENROUTER_API_KEY: "" };
    const result = spawnSync(process.execPath,
      ["--import", tsx, cli, "init", "--provider", "vercel", "--skill", "none"],
      { cwd: repo, env, input: "gateway-key\n", encoding: "utf8", timeout: 5_000 });
    expect(result.status).toBe(0);
    expect(JSON.parse(fs.readFileSync(path.join(home, ".config", "lgtm", "config.json"), "utf8"))).toEqual({
      provider: "vercel", keys: { vercel: "gateway-key" },
    });
  });

  it.each([
    ["vercel", "AI_GATEWAY_API_KEY", "Vercel AI Gateway"],
    ["openrouter", "OPENROUTER_API_KEY", "OpenRouter"],
  ] as const)("saves the explicit %s default when its key is in the environment", (provider, envName, label) => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cli-env-default-"));
    tempDirs.push(home);
    const env = { ...process.env, HOME: home, TYPESAFE_API_KEY: "", AI_GATEWAY_API_KEY: "", OPENROUTER_API_KEY: "" };
    const seed = spawnSync(process.execPath, ["--import", tsx, cli, "key", "typesafe-key", "--provider", "typesafe"],
      { cwd: repo, env, encoding: "utf8" });
    expect(seed.status).toBe(0);
    const selectedEnv = { ...env, [envName]: "provider-env-key" };
    const setup = spawnSync(process.execPath, ["--import", tsx, cli, "init", "--provider", provider, "--skill", "none"],
      { cwd: repo, env: selectedEnv, encoding: "utf8" });
    expect(setup.status).toBe(0);
    expect(JSON.parse(fs.readFileSync(path.join(home, ".config", "lgtm", "config.json"), "utf8"))).toEqual({
      provider, keys: { typesafe: "typesafe-key" },
    });
    const plan = spawnSync(process.execPath, ["--import", tsx, cli, "--dry-run", "src/ignore.test.ts"],
      { cwd: repo, env: selectedEnv, encoding: "utf8" });
    expect(plan.stdout).toContain(`API mode: ${label}`);
  });

  it("refuses a run when the selected provider has no key", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cli-no-key-"));
    tempDirs.push(home);
    const env = { ...process.env, HOME: home, TYPESAFE_API_KEY: "typesafe-env-key", AI_GATEWAY_API_KEY: "", OPENROUTER_API_KEY: "" };
    const result = spawnSync(process.execPath,
      ["--import", tsx, cli, "--provider", "vercel", "--yes", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("No Vercel AI Gateway API key. Run: lgtm key");
  });

  it("shows the saved Vercel mode in text and JSON dry runs", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-cli-mode-"));
    tempDirs.push(home);
    const env = { ...process.env, HOME: home, TYPESAFE_API_KEY: "", AI_GATEWAY_API_KEY: "" };
    const key = spawnSync(process.execPath, ["--import", "tsx", cli, "key", "gateway-key", "--provider", "vercel"],
      { cwd: repo, env, encoding: "utf8" });
    expect(key.status).toBe(0);
    const second = spawnSync(process.execPath, ["--import", "tsx", cli, "key", "typesafe-key", "--provider", "typesafe"],
      { cwd: repo, env, encoding: "utf8" });
    expect(second.status).toBe(0);
    const change = spawnSync(process.execPath, ["--import", "tsx", cli, "key", "default", "set", "vercel"],
      { cwd: repo, env, encoding: "utf8" });
    expect(change.status).toBe(0);
    const plan = spawnSync(process.execPath, ["--import", "tsx", cli, "--dry-run", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(plan.status).toBe(0);
    expect(plan.stdout).toContain("API mode: Vercel AI Gateway");
    expect(plan.stdout).toContain("billed by Vercel");
    expect(plan.stdout).toContain("paced at 10 requests/minute");
    expect(plan.stdout).toContain("at concurrency 1");
    const json = spawnSync(process.execPath, ["--import", "tsx", cli, "--dry-run", "--json", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(json.stderr).toContain("API mode: Vercel AI Gateway");
    expect(JSON.parse(json.stdout)).toBeInstanceOf(Array);
    const override = spawnSync(process.execPath, ["--import", "tsx", cli, "--provider", "typesafe", "--dry-run", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(override.stdout).toContain("API mode: TypeSafe");
    expect(override.stdout).not.toContain("paced at");
    const faster = spawnSync(process.execPath, ["--import", "tsx", cli, "--rate", "20", "--provider", "vercel", "--dry-run", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(faster.stdout).toContain("paced at 20 requests/minute");
    const current = spawnSync(process.execPath, ["--import", "tsx", cli, "key", "default"],
      { cwd: repo, env, encoding: "utf8" });
    expect(current.stdout).toContain("Default API mode: Vercel AI Gateway");
    const routerKey = spawnSync(process.execPath, ["--import", "tsx", cli, "key", "router-key", "--provider", "openrouter"],
      { cwd: repo, env, encoding: "utf8" });
    expect(routerKey.status).toBe(0);
    const routerPlan = spawnSync(process.execPath, ["--import", "tsx", cli, "--dry-run", "src/ignore.test.ts"],
      { cwd: repo, env, encoding: "utf8" });
    expect(routerPlan.stdout).toContain("API mode: OpenRouter");
    expect(routerPlan.stdout).toContain("at concurrency 4");
    expect(routerPlan.stdout).not.toContain("paced at");
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
    const plan = () => spawnSync(process.execPath, ["--import", tsx, cli, "--provider", "typesafe", "--dry-run", test], { cwd: dir, encoding: "utf8" });
    expect(plan().stdout).toContain("1 already cached, 0 to send");
    const file = path.join(cacheDir, fs.readdirSync(cacheDir)[0]!);
    fs.writeFileSync(file, "{");
    expect(plan().stdout).not.toContain("already cached");
  });
});
