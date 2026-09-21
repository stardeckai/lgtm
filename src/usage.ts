import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { usd } from "./checks/index.js";
import { c } from "./report.js";

export type Run = { at: string; tokens: number; provider?: "typesafe" | "vercel" | "openrouter"; worktree?: string };

/** The log is a file on disk anything can corrupt: `null`, `{}` and string tokens all parse, and would throw or total to NaN. */
const isRun = (v: unknown): v is Run =>
  typeof v === "object" && v !== null && Number.isFinite((v as Run).tokens) && !Number.isNaN(Date.parse((v as Run).at));

export const usagePath = (home: string = os.homedir()) => path.join(home, ".config", "lgtm", "usage.jsonl");

/** The worktree root, so runs can be attributed per checkout; undefined outside a repo. */
export function worktreeRoot(cwd = process.cwd()): string | undefined {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return undefined;
  }
}

/** Best-effort: a read-only home must never fail a run that already printed its report. */
export function recordRun(run: Run, home: string = os.homedir()): void {
  try {
    const file = usagePath(home);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.appendFileSync(file, JSON.stringify(run) + "\n");
  } catch {}
}

function readRuns(home: string = os.homedir()): Run[] {
  const file = usagePath(home);
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        const parsed: unknown = JSON.parse(line);
        return isRun(parsed) ? [parsed] : [];
      } catch {
        return [];
      }
    });
}

const DAY = 24 * 60 * 60 * 1000;

/** `worktree` is passed in, not defaulted: an explicit undefined must mean "not in a repo", which a default param cannot express. */
export function usageReport(now: number, worktree: string | undefined, home: string = os.homedir()): string {
  const runs = readRuns(home);
  if (runs.length === 0) return "no runs recorded yet — usage is logged to " + usagePath(home);
  const sum = (list: Run[]) => list.reduce((n, r) => n + r.tokens, 0);
  const since = (ms: number) => runs.filter((r) => Date.parse(r.at) >= now - ms);
  const line = (label: string, list: Run[]) =>
    `${label.padEnd(14)} ${c(["green", "bold"], usd(sum(list.filter((r) => r.provider !== "vercel"))).padStart(9))}  ${c("dim", `${sum(list)} tokens · ${list.length} ${list.length === 1 ? "run" : "runs"}${list.some((r) => r.provider === "vercel") ? " · Vercel billing excluded" : ""}`)}`;
  const out = [line("all time", runs), line("last day", since(DAY)), line("last week", since(7 * DAY))];
  if (worktree) out.push(line("this worktree", runs.filter((r) => r.worktree === worktree)));
  return out.join("\n");
}
