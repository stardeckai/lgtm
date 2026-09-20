# lgtm?

A Jev-powered linter for tests that pass but prove nothing.

`lgtm` sends each test block in your repo to [TypeSafe](https://docs.typesafe.ai)'s `systemOne` with a
fan-out of yes/no (Noul) questions — "would this still pass if the behavior were broken?", "is the mock
faking the exact seam under test?" — and reports the ones that come back confident as `file:line`.

It is advisory. By default it prints findings and exits 0.

## Install

```sh
bun add -g @stardeckai/lgtm
pnpm add -g @stardeckai/lgtm
npm i -g @stardeckai/lgtm
```

## Setup

```sh
lgtm init                    # paste your TypeSafe API key once; installs the /lgtm Claude Code skill
```

Running `lgtm` before setup exits with `😐✋  No API key. Run: lgtm init`.

`init` saves the key to `~/.config/lgtm/config.json` (mode 0600) and writes `~/.claude/skills/lgtm/SKILL.md`,
which teaches Claude Code to run `lgtm` and act on the findings. `TYPESAFE_API_KEY` in the environment
always wins over the config file. Get a key at <https://typesafe.ai>.

## Use

```sh
lgtm                       # every *.test.* / *.spec.* file under the cwd
lgtm src/user.test.ts      # one file, or a directory
lgtm --diff origin/main    # only tests changed vs a base, with the diff as evidence
lgtm --dry-run src         # print what would be sent, call nothing, no key needed
```

For a one-off run without installing: `npx @stardeckai/lgtm --dry-run src`.

```
😐👏 test/payment.test.ts:42  "rejects expired cards"
     mocks-seam-under-test 0.93 — Congratulations. You tested the mock.

😐🔥 test/refund.test.ts:17  "refunds a captured charge"
     swallowed-error-as-success 0.88 — Green. Production on fire.

2 tests prove nothing.

😐🫵
😐🎯  4 contract-integration · 19 mocked-seam · 8 pure-logic
14210 input tokens used
```

Every finding wears its check's face (see the table below). The summary faces:
👍 nothing to say, 🫵 findings, 🔍 a sub-threshold `--verbose` finding,
❓ blocks skipped by API errors, ✋ no API key. 🎯 is the distribution line. `--format github` and `--format json` stay plain.

### Flags

| flag | |
|---|---|
| `--diff <base>` | only test files changed vs `<base>` (two-dot, so uncommitted edits count), and put the diff in the state |
| `--threshold <0..1>` | override every check's threshold |
| `--only <ids,…>` / `--skip <ids,…>` | pick checks |
| `--format text\|github\|json` | `github` emits `::warning` annotations |
| `--concurrency <n>` | parallel requests, default 4 |
| `--no-impl` | don't send implementation source |
| `--no-cache` | ignore the answer cache |
| `--fail` | exit 1 when there are findings |
| `--fail-on-error` | exit 1 when a block was skipped by an API error |
| `--classes` | list every test with its class before the findings |
| `--verbose` | also show 0.5-to-threshold findings |
| `--list-checks` | print the checks |

## What lgtm likes

A test that crosses a seam with both sides real and asserts that they agree. That test fails when the
wiring breaks, which is how most things actually break.

It dislikes tests of one-line helpers (any real test of the feature covers them for free), tests that
mock everything except the function name, and one-off assertions that would survive the feature being
deleted. So the summary prints what your suite is made of — `🎯 contract-integration · 🧱 mocked-seam ·
🔬 pure-logic` — and `--classes` lists every test with its class, which is the number to watch during an
audit. Retiring three unit tests for one wider test that really fails is a win, not a coverage loss.

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
| 😐💀 | `regression-does-not-distinguish` | The bug passes this regression test too. *(needs `--diff`)* |
| 😐🧑‍🍳 | `changed-in-lockstep` | Test and implementation changed together. Cooked. *(needs `--diff`)* |

## CI

```yaml
- run: npx @stardeckai/lgtm --diff origin/${{ github.base_ref }} --format github
  env:
    TYPESAFE_API_KEY: ${{ secrets.TYPESAFE_API_KEY }}
```

Fetch enough history for the base ref (`fetch-depth: 0`) and add `--fail` once the findings are clean
enough that you want them blocking.

## Cost

One request per test block. Answers are cached by state hash under `node_modules/.cache/lgtm`, so a
re-run after editing one test only pays for that test. The imported implementation source is re-sent
with every block in a file and is capped at 8000 chars — it is the main cost lever, so `--no-impl`
cuts the bulk of each request at the price of weaker `would-pass-if-broken` and `reimplements-logic` answers.
The run prints its total input tokens.

## Config

The key lives in `~/.config/lgtm/config.json`. `TYPESAFE_API_KEY` in the environment always wins over it.

```sh
lgtm key <new-key>           # swap the saved key; `lgtm key` alone prompts
lgtm init                    # re-run any time to reinstall the Claude Code skill
```

## Thresholds

Every check reports at 0.8 by default. That is a starting point, not a law: run once with
`--threshold 0.5 --format json` on a suite you know well, look at where the real problems land, and
set `--threshold` per repo. A check that is consistently wrong for your codebase belongs in `--skip`.

## Development

This repo uses pnpm.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js --dry-run src   # no API key needed
```

## License

MIT
