---
name: lgtm
description: Run the lgtm test linter on the current branch or a path and act on its findings. Use when the user runs /lgtm, asks whether tests are any good, or asks which tests to delete or strengthen.
---

# lgtm

Run `lgtm --diff <default branch> --format json` (for example `lgtm --diff origin/main --format json`),
or `lgtm <path> --format json` when the user named a path.

`lgtm` is usually installed globally; in a repo that depends on it, run `pnpm lgtm` / `npx lgtm` instead.
If neither works, do not work around it — tell the user to run `npm i -g @stardeckai/lgtm && lgtm init` and stop there.

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

- `😐🫸` (p >= 0.9) — nope.
- `😐🤌` (threshold <= p < 0.9) — what exactly are we doing here.
- `😐🫴` (0.5 <= p < threshold) — explain this; only shown with `--verbose`.
- `😐👍` — the summary line when there is nothing to say.

## Checks

| | check | |
|---|---|---|
| 😐🚪 | `would-pass-if-broken` | The feature could leave the building. This test would wave. |
| 😐🤏 | `vacuous-assertion` | This assertion proves this much. |
| 😐💅 | `assertion-weaker-than-name` | Technically passes. The name wrote a cheque the assertion doesn't cash. |
| 😐🤝 | `reimplements-logic` | Test and implementation, shaking hands on the same bug. |
| 😐👏 | `mocks-seam-under-test` | Congratulations. You tested the mock. |
| 😐🪞 | `mock-mirrors-implementation` | The mock is the implementation in a wig. |
| 😐🙏 | `tests-calls-not-outcomes` | It was called. Please, one assertion about what happened next. |
| 😐🧠 | `tests-internals` | Tests how it's built, not what it does. A rename will kill it. |
| 😐🌀 | `setup-dominates` | The setup has become the application. |
| 😐📸 | `broad-snapshot` | Snapshot crime. Nobody will read it, everybody will update it. |
| 😐🔥 | `swallowed-error-as-success` | Green. Production on fire. |
| 😐🎭 | `impossible-fixture` | A state production can never reach. Confidence, but fake. |
| 😐🙌 | `happy-path-only-of-risky-boundary` | Wow, green CI. The refusal path that pages you is untested. |
| 😐🔬 | `trivial-primitive` | Tests a one-line helper in isolation. Any real test of the feature covers this for free. |
| 😐🧱 | `over-mocked` | Mocks all the way down. Nothing real is left to fail. |
| 😐💀 | `regression-does-not-distinguish` | The bug passes this regression test too. |
| 😐🧑‍🍳 | `changed-in-lockstep` | Test and implementation changed together. Cooked. |
