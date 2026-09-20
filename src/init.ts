import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { CHECKS } from "./checks.js";

export const configPath = (home: string = os.homedir()) => path.join(home, ".config", "lgtm", "config.json");
export const skillPath = (home: string = os.homedir()) => path.join(home, ".claude", "skills", "lgtm", "SKILL.md");

/** Key from the environment, else the global config file. */
export function resolveApiKey(home: string = os.homedir()): string | undefined {
  if (process.env.TYPESAFE_API_KEY) return process.env.TYPESAFE_API_KEY;
  try {
    return JSON.parse(fs.readFileSync(configPath(home), "utf8")).apiKey ?? undefined;
  } catch {
    return undefined;
  }
}

function skillMarkdown(): string {
  const checkList = [
    "| | check | |",
    "|---|---|---|",
    ...CHECKS.map((c) => `| 😐${c.emoji} | \`${c.id}\` | ${c.blurb} |`),
  ].join("\n");
  return `---
name: lgtm
description: Run the lgtm test linter on the current branch or a path and act on its findings. Use when the user runs /lgtm, asks whether tests are any good, or asks which tests to delete or strengthen.
---

# lgtm

Run \`lgtm --diff <default branch> --format json\` (for example \`lgtm --diff origin/main --format json\`),
or \`lgtm <path> --format json\` when the user named a path.

\`lgtm\` is installed globally. If the command is not found, do not work around it — tell the user to run
\`npm i -g @stardeckai/lgtm && lgtm init\` and stop there.

For each finding: read the test, then decide **keep**, **delete** or **replace**.

- Keep it only if you can complete "this test prevents us from shipping [specific incorrect behavior]".
- Delete it when the behavior it claims to protect is already covered, or when nothing plausible would break it.
- Replace it when the behavior matters but the test does not check it. A replacement counts only once you
  have shown it fail on the plausible bug — mutate or revert the behavior, watch it go red for the right
  reason, then restore.
- Never mock the seam under test. If both sides of a boundary are faked to agree, the test proves nothing.
- Prefer one wider test with real collaborators that retires several unit tests over patching each unit
  test in place. A good audit improves the suite while reducing the test count.

Report as a table: file:line, check id, verdict, one-line reason.

## Reading the output

- \`😐🫸\` (p >= 0.9) — nope.
- \`😐🤌\` (threshold <= p < 0.9) — what exactly are we doing here.
- \`😐🫴\` (0.5 <= p < threshold) — explain this; only shown with \`--verbose\`.
- \`😐👍\` — the summary line when there is nothing to say.

## Checks

${checkList}
`;
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

export async function init(opts: { key?: string; home?: string } = {}): Promise<string[]> {
  const home = opts.home ?? os.homedir();
  const written: string[] = [];

  let key = opts.key;
  if (!key && process.env.TYPESAFE_API_KEY) {
    console.log("TYPESAFE_API_KEY is already set in the environment — keeping it, not writing a config file.");
  } else if (!key) {
    key = await askKey();
  }

  if (key) written.push(saveKey(key, home));

  const skill = skillPath(home);
  fs.mkdirSync(path.dirname(skill), { recursive: true });
  fs.writeFileSync(skill, skillMarkdown());
  written.push(skill);

  return written;
}
