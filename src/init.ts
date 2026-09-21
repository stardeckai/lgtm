import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { TypeSafeClient } from "@typesafe-ai/sdk";
import { SKILLS } from "./skill.js";

export type SkillMode = "global" | "project" | "claude" | "none";
export type Provider = "typesafe" | "vercel" | "openrouter";
export type ApiConfig = { provider: Provider; apiKey: string };
type SavedConfig = { provider?: Provider; keys?: Partial<Record<Provider, string>>; apiKey?: string };
export const SKILL_MODES: SkillMode[] = ["global", "project", "claude", "none"];
export const PROVIDER_LABEL: Record<Provider, string> = {
  typesafe: "TypeSafe", vercel: "Vercel AI Gateway", openrouter: "OpenRouter",
};
export const providerModel = (provider: Provider) => provider === "vercel" ? "typesafe-ai/jev"
  : provider === "openrouter" ? "typesafe/jev-1.13" : "jev-latest";

export function createClient(config: ApiConfig): TypeSafeClient {
  if (config.provider === "openrouter") {
    return new TypeSafeClient({ apiKey: config.apiKey, timeout: 60_000,
      fetch: (_url, init) => fetch("https://openrouter.ai/api/alpha/decisions", init) });
  }
  return new TypeSafeClient({ apiKey: config.apiKey, timeout: 60_000,
    ...(config.provider === "vercel" ? { baseURL: "https://ai-gateway.vercel.sh/typesafe" } : {}) });
}

/** Package root — `dist/..` when installed, the repo root under vitest. Holds `skills/`. */
export const pkgRoot = fileURLToPath(new URL("..", import.meta.url));

export const configPath = (home: string = os.homedir()) => path.join(home, ".config", "lgtm", "config.json");
export const skillPath = (home: string = os.homedir(), name = "lgtm") =>
  path.join(home, ".claude", "skills", name, "SKILL.md");
export const projectSkillPath = (cwd: string = process.cwd(), name = "lgtm") =>
  path.join(cwd, ".claude", "skills", name, "SKILL.md");

function readConfig(home: string): SavedConfig {
  try {
    const value: unknown = JSON.parse(fs.readFileSync(configPath(home), "utf8"));
    return value && typeof value === "object" && !Array.isArray(value) ? value as SavedConfig : {};
  } catch { return {}; }
}

/** The selected provider's environment key wins over its saved key. Legacy configs use TypeSafe. */
export function resolveApiConfig(home: string = os.homedir(), selected?: Provider): ApiConfig | undefined {
  const saved = readConfig(home);
  const provider = selected ?? saved.provider ?? (process.env.TYPESAFE_API_KEY || saved.apiKey ? "typesafe"
    : process.env.AI_GATEWAY_API_KEY ? "vercel" : process.env.OPENROUTER_API_KEY ? "openrouter" : "typesafe");
  const envKey = provider === "vercel" ? process.env.AI_GATEWAY_API_KEY
    : provider === "openrouter" ? process.env.OPENROUTER_API_KEY : process.env.TYPESAFE_API_KEY;
  const apiKey = envKey || saved.keys?.[provider] || (provider === "typesafe" ? saved.apiKey : undefined);
  if (!apiKey) return undefined;
  return { provider, apiKey };
}

export function selectedProvider(home = os.homedir()): Provider {
  const saved = readConfig(home);
  return saved.provider ?? (saved.apiKey || process.env.TYPESAFE_API_KEY ? "typesafe"
    : process.env.AI_GATEWAY_API_KEY ? "vercel" : process.env.OPENROUTER_API_KEY ? "openrouter" : "typesafe");
}

/** Prompt for the provider and its key. */
export async function askKey(selected?: Provider): Promise<ApiConfig> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = selected ? "" : (await rl.question("API key provider: (t)ypeSafe, (v)ercel AI Gateway, or (o)penRouter? [t] ")).trim().toLowerCase();
    const provider = selected ?? (answer.startsWith("v") ? "vercel" : answer.startsWith("o") ? "openrouter" : "typesafe");
    const url = provider === "vercel" ? "https://vercel.com/ai-gateway"
      : provider === "openrouter" ? "https://openrouter.ai/settings/keys" : "https://typesafe.ai";
    const apiKey = (await rl.question(`Paste your ${PROVIDER_LABEL[provider]} API key (${url}): `)).trim();
    return { provider, apiKey };
  } finally {
    rl.close();
  }
}

/** Write one key and make it active, preserving the other provider's key. */
export function saveKey(key: string, home = os.homedir(), provider: Provider = "typesafe"): string {
  const config = configPath(home);
  fs.mkdirSync(path.dirname(config), { recursive: true, mode: 0o700 });
  const saved = readConfig(home);
  const keys = { ...(saved.apiKey ? { typesafe: saved.apiKey } : {}), ...saved.keys, [provider]: key };
  fs.writeFileSync(config, JSON.stringify({ provider, keys }, null, 2) + "\n", { mode: 0o600 });
  fs.chmodSync(config, 0o600);
  return config;
}

export function setDefaultProvider(provider: Provider, home = os.homedir()): string {
  if (!resolveApiConfig(home, provider)) throw new Error(`No ${provider} API key saved or set in the environment`);
  const config = configPath(home);
  const saved = readConfig(home);
  const keys = { ...(saved.apiKey ? { typesafe: saved.apiKey } : {}), ...saved.keys };
  fs.mkdirSync(path.dirname(config), { recursive: true, mode: 0o700 });
  fs.writeFileSync(config, JSON.stringify({ provider, keys }, null, 2) + "\n", { mode: 0o600 });
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
  opts: { key?: string; provider?: Provider; home?: string; cwd?: string; skill?: SkillMode; yes?: boolean; spawn?: Spawn } = {},
): Promise<string[]> {
  const home = opts.home ?? os.homedir();
  const written: string[] = [];

  let config: ApiConfig | undefined = opts.key ? { provider: opts.provider ?? selectedProvider(home), apiKey: opts.key } : undefined;
  const envKey = opts.provider === "typesafe" ? process.env.TYPESAFE_API_KEY
    : opts.provider === "vercel" ? process.env.AI_GATEWAY_API_KEY
    : opts.provider === "openrouter" ? process.env.OPENROUTER_API_KEY
    : process.env.TYPESAFE_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.OPENROUTER_API_KEY;
  if (!config && envKey) {
    console.log("An API key is already set in the environment — keeping it, not writing a config file.");
  } else if (!config) {
    config = await askKey(opts.provider);
  }
  if (config?.apiKey) written.push(saveKey(config.apiKey, home, config.provider));

  const mode = opts.skill ?? (opts.yes ? "global" : await askSkillMode());
  written.push(...installSkill(mode, { home, cwd: opts.cwd, spawn: opts.spawn }));

  return written;
}
