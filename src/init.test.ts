import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  configPath,
  createClient,
  init,
  pkgRoot,
  projectSkillPath,
  providerModel,
  resolveApiConfig,
  selectedProvider,
  setDefaultProvider,
  skillPath,
  type Spawn,
} from "./init.js";
import { checksTable, SKILLS } from "./skill.js";

const dirs: string[] = [];
const tmp = (): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-"));
  dirs.push(dir);
  return dir;
};

afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  delete process.env.TYPESAFE_API_KEY;
  delete process.env.AI_GATEWAY_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
});

/** A shell script named `npx` that records its argv and exits with `code`. */
function fakeNpx(code: number): { spawn: Spawn; argv: () => string[] } {
  const bin = tmp();
  const log = path.join(bin, "argv.txt");
  fs.writeFileSync(path.join(bin, "npx"), `#!/bin/sh\nprintf '%s\\n' "$@" > ${log}\nexit ${code}\n`, { mode: 0o755 });
  const spawn: Spawn = (cmd, args, opts) =>
    spawnSync(cmd, args, { ...opts, env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
  return { spawn, argv: () => fs.readFileSync(log, "utf8").trimEnd().split("\n") };
}

describe("init", () => {
  it("writes a 0600 config the CLI reads back plus the Claude skill", async () => {
    const home = tmp();
    const written = await init({ key: "sk-test-123", home, skill: "claude" });

    expect(written).toEqual([configPath(home), skillPath(home), skillPath(home, "actually-test")]);
    expect(JSON.parse(fs.readFileSync(configPath(home), "utf8"))).toEqual({ provider: "typesafe", keys: { typesafe: "sk-test-123" } });
    expect(fs.statSync(configPath(home)).mode & 0o777).toBe(0o600);
    expect(resolveApiConfig(home)).toEqual({ provider: "typesafe", apiKey: "sk-test-123" });
    for (const { name, markdown } of SKILLS) {
      expect(fs.readFileSync(skillPath(home, name), "utf8")).toBe(markdown());
    }
  });

  it("writes no skill file at all with --skill none", async () => {
    const home = tmp();
    const cwd = tmp();
    const written = await init({ key: "sk-test-123", home, cwd, skill: "none" });

    expect(written).toEqual([configPath(home)]);
    expect(fs.existsSync(skillPath(home))).toBe(false);
    expect(fs.existsSync(skillPath(home, "actually-test"))).toBe(false);
    expect(fs.existsSync(projectSkillPath(cwd))).toBe(false);
    expect(fs.existsSync(projectSkillPath(cwd, "actually-test"))).toBe(false);
  });

  it("hands the bundled skill dir to the skills CLI, without -g for a project install", async () => {
    const npx = fakeNpx(0);
    const home = tmp();
    const cwd = tmp();

    await init({ key: "sk", home, cwd, skill: "project", spawn: npx.spawn });

    expect(npx.argv()).toEqual(["-y", "skills", "add", path.join(pkgRoot, "skills")]);
    expect(fs.existsSync(projectSkillPath(cwd))).toBe(false);
  });

  it("falls back to the project Claude skill when the skills CLI exits non-zero", async () => {
    const npx = fakeNpx(1);
    const home = tmp();
    const cwd = tmp();

    await init({ key: "sk", home, cwd, skill: "project", spawn: npx.spawn });

    for (const { name, markdown } of SKILLS) {
      expect(fs.readFileSync(projectSkillPath(cwd, name), "utf8")).toBe(markdown());
    }
    expect(fs.existsSync(skillPath(home))).toBe(false);
  });

  it("prefers the environment key over the config file", async () => {
    const home = tmp();
    await init({ key: "sk-from-config", home, skill: "none" });
    process.env.TYPESAFE_API_KEY = "sk-from-env";
    expect(resolveApiConfig(home)).toEqual({ provider: "typesafe", apiKey: "sk-from-env" });
  });

  it("uses the Vercel key and ignores a TypeSafe key after switching modes", async () => {
    const home = tmp();
    await init({ key: "gateway-key", provider: "vercel", home, skill: "none" });
    process.env.TYPESAFE_API_KEY = "old-typesafe-key";
    process.env.AI_GATEWAY_API_KEY = "gateway-env-key";
    expect(resolveApiConfig(home)).toEqual({ provider: "vercel", apiKey: "gateway-env-key" });
  });

  it("keeps both keys and switches the active provider", async () => {
    const home = tmp();
    await init({ key: "typesafe-key", home, skill: "none" });
    await init({ key: "gateway-key", provider: "vercel", home, skill: "none" });
    expect(JSON.parse(fs.readFileSync(configPath(home), "utf8"))).toEqual({
      provider: "vercel", keys: { typesafe: "typesafe-key", vercel: "gateway-key" },
    });
    expect(resolveApiConfig(home)).toEqual({ provider: "vercel", apiKey: "gateway-key" });
    expect(resolveApiConfig(home, "typesafe")).toEqual({ provider: "typesafe", apiKey: "typesafe-key" });
    setDefaultProvider("typesafe", home);
    expect(selectedProvider(home)).toBe("typesafe");
    expect(resolveApiConfig(home)).toEqual({ provider: "typesafe", apiKey: "typesafe-key" });
    expect(resolveApiConfig(home, "vercel")).toEqual({ provider: "vercel", apiKey: "gateway-key" });
  });

  it("stores an OpenRouter key alongside the others and selects its endpoint and model", async () => {
    const home = tmp();
    await init({ key: "typesafe-key", home, skill: "none" });
    await init({ key: "router-key", provider: "openrouter", home, skill: "none" });
    expect(resolveApiConfig(home)).toEqual({ provider: "openrouter", apiKey: "router-key" });
    expect(resolveApiConfig(home, "typesafe")).toEqual({ provider: "typesafe", apiKey: "typesafe-key" });
    expect(providerModel("openrouter")).toBe("typesafe/jev-1.13");

    let url = "";
    let body: Record<string, unknown> = {};
    let authorization = "";
    vi.stubGlobal("fetch", async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      url = String(input);
      body = JSON.parse(String(init?.body));
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      return new Response(JSON.stringify({ model: "typesafe/jev-1.13", answers: { yes: { type: "noul", noul: 0.9 } },
        usage: { input_tokens: 42, output_tokens: 0 } }),
        { status: 200, headers: { "content-type": "application/json" } });
    });
    try {
      const result = await createClient({ provider: "openrouter", apiKey: "router-key" }).systemOne({
        model: providerModel("openrouter"), state: "state", questions: { yes: { type: "noul", instructions: "yes?" } },
      });
      expect(url).toBe("https://openrouter.ai/api/alpha/decisions");
      expect(body.model).toBe("typesafe/jev-1.13");
      expect(body.state).toBe("state");
      expect(authorization).toBe("Bearer router-key");
      expect(result.answers.yes).toEqual({ type: "noul", noul: 0.9 });
      expect(result.usage.input_tokens).toBe(42);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("sends Vercel requests to its gateway with the selected key and model", async () => {
    let url = "";
    let authorization = "";
    let model = "";
    vi.stubGlobal("fetch", async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      url = String(input);
      authorization = new Headers(init?.headers).get("authorization") ?? "";
      model = JSON.parse(String(init?.body)).model;
      return new Response(JSON.stringify({ model: "typesafe-ai/jev", answers: { yes: { type: "noul", noul: 0.9 } },
        usage: { input_tokens: 42, output_tokens: 0 } }),
        { status: 200, headers: { "content-type": "application/json" } });
    });
    try {
      const result = await createClient({ provider: "vercel", apiKey: "gateway-key" }).systemOne({
        model: providerModel("vercel"), state: "state", questions: { yes: { type: "noul", instructions: "yes?" } },
      });
      expect(url).toBe("https://ai-gateway.vercel.sh/typesafe/v1/systemone");
      expect(authorization).toBe("Bearer gateway-key");
      expect(model).toBe("typesafe-ai/jev");
      expect(result.answers.yes).toEqual({ type: "noul", noul: 0.9 });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("refuses to select a provider without a key", async () => {
    const home = tmp();
    await init({ key: "typesafe-key", home, skill: "none" });
    expect(() => setDefaultProvider("vercel", home)).toThrow("No vercel API key");
    expect(selectedProvider(home)).toBe("typesafe");
  });

  it("reads legacy TypeSafe configs and an environment-only Vercel key", () => {
    const home = tmp();
    process.env.AI_GATEWAY_API_KEY = "gateway-env-key";
    expect(resolveApiConfig(home)).toEqual({ provider: "vercel", apiKey: "gateway-env-key" });
    fs.mkdirSync(path.dirname(configPath(home)), { recursive: true });
    fs.writeFileSync(configPath(home), JSON.stringify({ apiKey: "legacy-key" }));
    expect(resolveApiConfig(home)).toEqual({ provider: "typesafe", apiKey: "legacy-key" });
    expect(resolveApiConfig(home, "vercel")).toEqual({ provider: "vercel", apiKey: "gateway-env-key" });
  });

  it("uses an environment-only OpenRouter key", () => {
    const home = tmp();
    process.env.OPENROUTER_API_KEY = "router-env-key";
    expect(resolveApiConfig(home)).toEqual({ provider: "openrouter", apiKey: "router-env-key" });
  });
});

it.each(SKILLS)("ships skills/$name/SKILL.md in sync with its generator", ({ name, markdown }) => {
  const shipped = fs.readFileSync(fileURLToPath(new URL(`../skills/${name}/SKILL.md`, import.meta.url)), "utf8");
  expect(shipped, `skills/${name}/SKILL.md is stale — run \`pnpm gen:skill\``).toBe(markdown());
});

it("keeps the README checks table in sync with the checks", () => {
  const readme = fs.readFileSync(path.join(pkgRoot, "README.md"), "utf8");
  const block = readme.slice(readme.indexOf("<!-- checks:start -->") + "<!-- checks:start -->".length, readme.indexOf("<!-- checks:end -->")).trim();
  expect(block, "README checks table is stale — run `pnpm gen:skill`").toBe(checksTable());
});
