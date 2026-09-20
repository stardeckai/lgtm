import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { SKILLS } from "./skill.js";

export type SkillMode = "global" | "project" | "claude" | "none";
export const SKILL_MODES: SkillMode[] = ["global", "project", "claude", "none"];

/** Package root — `dist/..` when installed, the repo root under vitest. Holds `skills/`. */
export const pkgRoot = fileURLToPath(new URL("..", import.meta.url));

export const configPath = (home: string = os.homedir()) => path.join(home, ".config", "lgtm", "config.json");
export const skillPath = (home: string = os.homedir(), name = "lgtm") =>
  path.join(home, ".claude", "skills", name, "SKILL.md");
export const projectSkillPath = (cwd: string = process.cwd(), name = "lgtm") =>
  path.join(cwd, ".claude", "skills", name, "SKILL.md");

/** Key from the environment, else the global config file. */
export function resolveApiKey(home: string = os.homedir()): string | undefined {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY;
  try {
    return JSON.parse(fs.readFileSync(configPath(home), "utf8")).apiKey ?? undefined;
  } catch {
    return undefined;
  }
}

/** Prompt for a key unless one was given. */
export async function askKey(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const key = (await rl.question("Paste your TypeSafe API key (https://typesafe.ai): ")).trim();
  rl.close();
  return key;
}

/** Write (or replace) the saved key; returns the config path. `lgtm key` uses this directly. */
export function saveKey(key: string, home = os.homedir()): string {
  const config = configPath(home);
  fs.mkdirSync(path.dirname(config), { recursive: true, mode: 0o700 });
  fs.writeFileSync(config, JSON.stringify({ apiKey: key }, null, 2) + "\n", { mode: 0o600 });
  fs.chmodSync(config, 0o600);
  return config;
}

export async function askSkillMode(): Promise<SkillMode> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const yes = (await rl.question("Install the /lgtm and /actually-test skills for your coding agents? [Y/n] "))
      .trim()
      .toLowerCase();
    if (yes.startsWith("n")) return "none";
    const where = (await rl.question("Where? (g)lobal for every project / (p)roject only [g] ")).trim().toLowerCase();
    return where.startsWith("p") ? "project" : "global";
  } finally {
    rl.close();
  }
}

/** Write every bundled skill under `.claude/skills/<name>/SKILL.md` at `root`; returns the files. */
function writeSkillFiles(root: string): string[] {
  return SKILLS.map(({ name, markdown }) => {
    const file = path.join(root, ".claude", "skills", name, "SKILL.md");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, markdown());
    return file;
  });
}

export type Spawn = (
  cmd: string,
  args: string[],
  opts: { stdio: "inherit"; cwd: string },
) => { status: number | null; error?: Error };

/**
 * Hand the bundled skills to the `skills` CLI (which asks the user which agents to install to).
 * Falls back to writing the Claude Code skills directly when that CLI can't run.
 * Returns the paths worth printing, empty when nothing else needs saying.
 */
export function installSkill(mode: SkillMode, opts: { home?: string; cwd?: string; spawn?: Spawn } = {}): string[] {
  if (mode === "none") return [];
  const home = opts.home ?? os.homedir();
  const cwd = opts.cwd ?? process.cwd();
  if (mode === "claude") return writeSkillFiles(home);

  const args = ["-y", "skills", "add", path.join(pkgRoot, "skills")];
  if (mode === "global") args.push("-g");
  const res = (opts.spawn ?? spawnSync)("npx", args, { stdio: "inherit", cwd });
  if (!res.error && res.status === 0) return [];

  const files = writeSkillFiles(mode === "global" ? home : cwd);
  console.log(`skills CLI unavailable, installed for Claude Code only at ${files.join(", ")}`);
  return [];
}

/** Step 1: save the key. Step 2: install the skills. Returns the files worth printing. */
export async function init(
  opts: { key?: string; home?: string; cwd?: string; skill?: SkillMode; yes?: boolean; spawn?: Spawn } = {},
): Promise<string[]> {
  const home = opts.home ?? os.homedir();
  const written: string[] = [];

  let key = opts.key;
  if (!key && process.env.TYPESAFE_API_KEY) {
    console.log("TYPESAFE_API_KEY is already set in the environment — keeping it, not writing a config file.");
  } else if (!key) {
    key = await askKey();
  }
  if (key) written.push(saveKey(key, home));

  const mode = opts.skill ?? (opts.yes ? "global" : await askSkillMode());
  written.push(...installSkill(mode, { home, cwd: opts.cwd, spawn: opts.spawn }));

  return written;
}
