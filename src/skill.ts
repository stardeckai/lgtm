import { CHECKS } from "./checks/index.js";

/** The /lgtm skill, generated into skills/lgtm/SKILL.md by `pnpm gen:skill`. */
export function skillMarkdown(): string {
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

First run \`lgtm --diff <default branch>\` (or \`lgtm <path>\` when the user named a path) without \`--yes\`: in a
non-interactive shell it only prints the plan — files, estimated cost and runtime — and exits. Tell the user the
estimate in one line. Then run the same command again with \`--yes --format json\` to actually analyse
(for example \`lgtm --diff origin/main --yes --format json\`). Add \`--lean\` if the estimate is large.

\`lgtm\` is usually installed globally; in a repo that depends on it, run \`pnpm lgtm\` / \`npx lgtm\` instead.
If neither works, do not work around it — tell the user to run \`npm i -g @stardeckai/lgtm && lgtm init\` and stop there.

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

Every finding wears its check's glyph after the \`😐\` face (table below) with the probability next to it; the
colour is the severity (red ≥ 0.9, yellow at or over the check's threshold, dim for \`--verbose\` suspects marked
\`😐🔍\`). Summary faces: \`😐👍\` nothing to say, \`😐🫵\` findings, \`😐❓\` API skips, \`😐✋\` no API key,
\`😐🎯\` the class distribution (contract-integration is the good kind).

## Checks

${checkList}
`;
}
