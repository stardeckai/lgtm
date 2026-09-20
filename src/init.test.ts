import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import {
  configPath,
  init,
  pkgRoot,
  projectSkillPath,
  resolveApiKey,
  skillPath,
  type Spawn,
} from "./init.js";
import { skillMarkdown } from "./skill.js";

const dirs: string[] = [];
const tmp = (): string => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-"));
  dirs.push(dir);
  return dir;
};

afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
  delete process.env.TYPESAFE_API_KEY;
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

    expect(written).toEqual([configPath(home), skillPath(home)]);
    expect(JSON.parse(fs.readFileSync(configPath(home), "utf8"))).toEqual({ apiKey: "sk-test-123" });
    expect(fs.statSync(configPath(home)).mode & 0o777).toBe(0o600);
    expect(resolveApiKey(home)).toBe("sk-test-123");
    expect(fs.readFileSync(skillPath(home), "utf8")).toBe(skillMarkdown());
  });

  it("writes no skill file at all with --skill none", async () => {
    const home = tmp();
    const cwd = tmp();
    const written = await init({ key: "sk-test-123", home, cwd, skill: "none" });

    expect(written).toEqual([configPath(home)]);
    expect(fs.existsSync(skillPath(home))).toBe(false);
    expect(fs.existsSync(projectSkillPath(cwd))).toBe(false);
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

    expect(fs.readFileSync(projectSkillPath(cwd), "utf8")).toBe(skillMarkdown());
    expect(fs.existsSync(skillPath(home))).toBe(false);
  });

  it("prefers the environment key over the config file", async () => {
    const home = tmp();
    await init({ key: "sk-from-config", home, skill: "none" });
    process.env.TYPESAFE_API_KEY = "sk-from-env";
    expect(resolveApiKey(home)).toBe("sk-from-env");
  });
});

it("ships skills/lgtm/SKILL.md in sync with skillMarkdown()", () => {
  const shipped = fs.readFileSync(fileURLToPath(new URL("../skills/lgtm/SKILL.md", import.meta.url)), "utf8");
  expect(shipped, "skills/lgtm/SKILL.md is stale — run `pnpm gen:skill`").toBe(skillMarkdown());
});
