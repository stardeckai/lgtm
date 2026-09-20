import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { recordRun, usagePath, usageReport, worktreeRoot } from "./usage.js";

const tmpHome = () => fs.mkdtempSync(path.join(os.tmpdir(), "lgtm-usage-"));

describe("usageReport", () => {
  it("sums the right runs into each window", () => {
    const home = tmpHome();
    const now = Date.parse("2026-09-20T12:00:00Z");
    const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
    recordRun({ at: hoursAgo(1), tokens: 1_000_000, worktree: "/w/a" }, home);
    recordRun({ at: hoursAgo(48), tokens: 200_000, worktree: "/w/b" }, home);
    recordRun({ at: hoursAgo(24 * 30), tokens: 30_000, worktree: "/w/a" }, home);

    const report = usageReport(now, "/w/a", home);
    expect(report).toMatch(/all time\s+\$0\.0517\s+1230000 tokens · 3 runs/);
    expect(report).toMatch(/last day\s+\$0\.0420\s+1000000 tokens · 1 run\b/);
    expect(report).toMatch(/last week\s+\$0\.0504\s+1200000 tokens · 2 runs/);
    expect(report).toMatch(/this worktree\s+\$0\.0433\s+1030000 tokens · 2 runs/);
  });

  it("says nothing is recorded when the log is missing", () => {
    expect(usageReport(Date.now(), "/w/a", tmpHome())).toContain("no runs recorded yet");
  });

  it("still totals the good lines when an append was cut short", () => {
    const home = tmpHome();
    recordRun({ at: new Date().toISOString(), tokens: 1_000_000 }, home);
    fs.appendFileSync(usagePath(home), '{"at":"2026-09-20T00:00:00Z","tok\n');

    expect(usageReport(Date.now(), undefined, home)).toMatch(/all time\s+\$0\.0420\s+1000000 tokens · 1 run\b/);
  });

  it("skips records that parse but are not runs, instead of throwing or totalling NaN", () => {
    const home = tmpHome();
    recordRun({ at: new Date().toISOString(), tokens: 1_000_000 }, home);
    fs.appendFileSync(usagePath(home), 'null\n{}\n{"at":"x","tokens":"5"}\n{"at":"nonsense","tokens":9}\n');

    expect(usageReport(Date.now(), undefined, home)).toMatch(/all time\s+\$0\.0420\s+1000000 tokens · 1 run\b/);
  });

  it("omits the worktree line outside a repo", () => {
    const home = tmpHome();
    recordRun({ at: new Date().toISOString(), tokens: 1_000_000, worktree: "/w/a" }, home);

    expect(usageReport(Date.now(), undefined, home)).not.toContain("this worktree");
  });

  it("counts only this worktree's runs, not the whole machine's", () => {
    const home = tmpHome();
    const at = new Date().toISOString();
    recordRun({ at, tokens: 1_000_000, worktree: "/w/a" }, home);
    recordRun({ at, tokens: 500_000, worktree: "/w/a/nested" }, home);
    recordRun({ at, tokens: 300_000 }, home);

    expect(usageReport(Date.now(), "/w/a", home)).toMatch(/this worktree\s+\$0\.0420\s+1000000 tokens · 1 run\b/);
  });
});

describe("recordRun", () => {
  it("does not throw when the log cannot be written", () => {
    const home = tmpHome();
    // A file where ~/.config/lgtm must be: the run already printed its report, losing the line is the lesser evil.
    fs.mkdirSync(path.join(home, ".config"));
    fs.writeFileSync(path.join(home, ".config", "lgtm"), "not a directory");

    expect(() => recordRun({ at: new Date().toISOString(), tokens: 10 }, home)).not.toThrow();
  });
});

describe("worktreeRoot", () => {
  it("is undefined outside a git repo, so nothing is attributed to a bogus path", () => {
    expect(worktreeRoot(tmpHome())).toBeUndefined();
  });

  it("is the linked worktree's own root, not the main checkout it branched from", () => {
    // Runs in a real linked worktree: the whole point of `this worktree` is that two checkouts of one repo bill apart.
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("GIT_")));
    const main = fs.realpathSync(fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "lgtm-main-")));
    const git = (cwd: string, args: string[]) =>
      execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", ...args], { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    git(main, ["init", "-b", "main"]);
    fs.writeFileSync(path.join(main, "f.txt"), "x");
    git(main, ["add", "-A"]);
    git(main, ["commit", "-m", "base"]);
    const linked = path.join(main, "..", path.basename(main) + "-wt");
    git(main, ["worktree", "add", "-b", "side", linked]);

    const root = worktreeRoot(fs.realpathSync(linked));
    expect(root).toBe(fs.realpathSync(linked));
    expect(root).not.toBe(main);
    expect(worktreeRoot(path.join(main, "."))).toBe(main);
  });
});
