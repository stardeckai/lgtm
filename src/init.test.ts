import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CHECKS } from "./checks.js";
import { configPath, init, resolveApiKey, skillPath } from "./init.js";

let home: string;
afterEach(() => {
  fs.rmSync(home, { recursive: true, force: true });
  delete process.env.TYPESAFE_API_KEY;
});

describe("init", () => {
  it("writes a 0600 config the CLI can read back and a skill naming every check", async () => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-home-"));
    delete process.env.TYPESAFE_API_KEY;

    const written = await init({ key: "sk-test-123", home });

    expect(written).toEqual([configPath(home), skillPath(home)]);
    expect(JSON.parse(fs.readFileSync(configPath(home), "utf8"))).toEqual({ apiKey: "sk-test-123" });
    expect(fs.statSync(configPath(home)).mode & 0o777).toBe(0o600);
    expect(resolveApiKey(home)).toBe("sk-test-123");

    const skill = fs.readFileSync(skillPath(home), "utf8");
    expect(skill.startsWith("---\nname: lgtm\n")).toBe(true);
    for (const check of CHECKS) expect(skill).toContain(`\`${check.id}\``);
  });

  it("prefers the environment key over the config file", async () => {
    home = fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-home-"));
    await init({ key: "sk-from-config", home });
    process.env.TYPESAFE_API_KEY = "sk-from-env";
    expect(resolveApiKey(home)).toBe("sk-from-env");
  });
});
