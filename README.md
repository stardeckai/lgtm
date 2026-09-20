# 😐👍 lgtm?

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

```sh
# or per project
pnpm add -D @stardeckai/lgtm   # then: pnpm lgtm ...   (npm: npx lgtm ...)
```

## Setup

```sh
lgtm init                    # paste your API key, then install the /lgtm skill
```

`init` does two things.

1. Saves the key to `~/.config/lgtm/config.json` (mode 0600). `TYPESAFE_API_KEY` in the environment always
   wins over it. Get a key at <https://typesafe.ai>.
2. Offers to install the `/lgtm` skill, which teaches your coding agents to run `lgtm` and act on the
   findings. It hands the bundled skill to the [`skills`](https://www.npmjs.com/package/skills) CLI, which
   asks which agents you want it in — globally or in this project only.

Skip the prompts with `--skill <where>`:

| `--skill` | |
|---|---|
| `global` | every project, via the `skills` CLI (what `--yes` picks) |
| `project` | this project only, via the `skills` CLI |
| `claude` | write `~/.claude/skills/lgtm/SKILL.md` directly, no `npx` |
| `none` | skip it |

If the `skills` CLI can't run, `init` falls back to writing the Claude Code skill itself.

Running `lgtm` before setup exits with `😐✋  No API key. Run: lgtm init`.

## Use

```sh
lgtm                       # every *.test.* / *.spec.* file under the cwd
lgtm src/user.test.ts      # one file, or a directory
lgtm --diff origin/main    # only tests changed vs a base, with the diff as evidence
lgtm --dry-run src         # only the plan: files, estimated cost and runtime; no key needed
```

Every run starts with that plan and asks `Run? [Y/n]`. Outside a terminal (CI, an agent) it stops after the plan
unless you pass `--yes`.

```sh
lgtm --yes --format json   # non-interactive
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
| `--lean` | smaller, cheaper states: 8k of implementation, no test file, no repo guidelines |
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

<!-- evals:start -->
## Evals

`evals/cases` holds 525 labelled test cases — synthetic and anonymized real-world, with positives, hard negatives and genuinely good tests — with the ground truth kept in `expect.json` so it never reaches the model.

Scores are at each check's own threshold. 114 of the cases are holdout — never used to fit a threshold or a prompt.

| check | cases | threshold | precision (holdout) | recall (holdout) | precision (all) | recall (all) |
|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 63 | 0.35 | 1.00 | 1.00 | 1.00 | 0.89 |
| `vacuous-assertion` | 157 | 0.30 | 1.00 | 1.00 | 1.00 | 0.96 |
| `assertion-weaker-than-name` | 58 | 0.55 | 1.00 | 0.89 | 1.00 | 0.95 |
| `reimplements-logic` | 188 | 0.75 | 1.00 | 1.00 | 1.00 | 0.95 |
| `mocks-seam-under-test` | 102 | 0.60 | 1.00 | 1.00 | 1.00 | 0.89 |
| `mock-mirrors-implementation` | 25 | 0.50 | 1.00 | 1.00 | 1.00 | 1.00 |
| `tests-calls-not-outcomes` | 53 | 0.30 | 1.00 | 1.00 | 1.00 | 0.89 |
| `tests-internals` | 41 | 0.60 | 1.00 | 1.00 | 1.00 | 1.00 |
| `setup-dominates` | 40 | 0.85 | 1.00 | 1.00 | 1.00 | 1.00 |
| `broad-snapshot` | 39 | 0.30 | 0.75 | 1.00 | 0.93 | 0.93 |
| `swallowed-error-as-success` | 56 | 0.75 | 1.00 | 0.75 | 1.00 | 0.81 |
| `impossible-fixture` | 49 | 0.60 | 1.00 | 1.00 | 1.00 | 0.88 |
| `happy-path-only-of-risky-boundary` | 70 | 0.55 | 1.00 | 1.00 | 1.00 | 0.89 |
| `trivial-primitive` | 104 | 0.65 | 0.80 | 1.00 | 0.94 | 0.89 |
| `over-mocked` | 59 | 0.75 | 1.00 | 1.00 | 1.00 | 1.00 |
| `regression-does-not-distinguish` | 26 | 0.45 | 1.00 | 0.33 | 1.00 | 0.67 |
| `changed-in-lockstep` | 26 | 0.70 | 0.80 | 1.00 | 0.94 | 1.00 |

Test class accuracy — all: 453/525 (0.86) · holdout: 99/114 (0.87).

A full cold run of the corpus costs 1627010 input tokens ≈ $0.0683; re-runs hit the cache and only pay for changed cases.

Every miss and false positive is listed in [`evals/RESULTS.md`](evals/RESULTS.md). Reproduce with `pnpm eval`.
<!-- evals:end -->

## CI

```yaml
- uses: actions/cache@v4
  with:
    path: node_modules/.cache/lgtm
    key: lgtm-${{ hashFiles('**/pnpm-lock.yaml', '**/package-lock.json') }}
    restore-keys: lgtm-
- run: npx @stardeckai/lgtm --diff origin/${{ github.base_ref }} --yes --format github
  env:
    TYPESAFE_API_KEY: ${{ secrets.TYPESAFE_API_KEY }}
```

The cache step is optional: `--diff` already limits a PR run to the tests it touched, and answers are keyed by the
full state (test, imports, implementation, guidelines) plus the check wording and lgtm version, so a hit means
nothing relevant changed. Do not commit the cache directory; it churns on every refactor and never shrinks.

Fetch enough history for the base ref (`fetch-depth: 0`) and add `--fail` once the findings are clean
enough that you want them blocking.

## Cost

TypeSafe bills $0.042 per million input tokens and nothing for output, so lgtm is cheap enough to run on every PR.
One request per test block. Each state is trimmed to at most 100,000 chars (~25,000 tokens, under TypeSafe's 32k
state limit): the test code, the whole test file with the block fenced, the file's imports and sibling test names,
up to 60,000 chars of the imported implementation (one hop deep) and the test sections of any CLAUDE.md/AGENTS.md
above it. `--lean` cuts that back to the old 8,000-char implementation and no test file or guidelines.

| run | blocks | input tokens | cost |
|---|---|---|---|
| a PR touching 20 tests (`--diff`) | 20 | ~100k | ~$0.004 |
| a mid-sized suite | 500 | ~2.5M | ~$0.11 |
| a large monorepo suite | 5,000 | ~25M | ~$1.05 |
| the same runs with `--lean` | | about half | |
| the eval corpus (`pnpm eval`, cold) | 525 | see the Evals section | |

Answers are cached by state hash under `node_modules/.cache/lgtm`, so a re-run after editing one test only pays for
that test. The implementation source is the main cost lever: `--no-impl` cuts the bulk of each request at the price
of weaker `would-pass-if-broken` and `reimplements-logic` answers. Every run prints its input tokens and the
estimated cost.

## Config

The key lives in `~/.config/lgtm/config.json`. `TYPESAFE_API_KEY` in the environment always wins over it.

```sh
lgtm key <new-key>           # swap the saved key; `lgtm key` alone prompts
lgtm skill                   # (re)install the /lgtm skill, e.g. to add another agent
lgtm init                    # both steps again
```

## Thresholds

Every check reports at 0.8 by default. That is a starting point, not a law: run once with
`--threshold 0.5 --format json` on a suite you know well, look at where the real problems land, and
set `--threshold` per repo. A check that is consistently wrong for your codebase belongs in `--skip`.

## Development

This repo uses pnpm.

Each check is one file under `src/checks/<category>/`; add a new one there and register it in `src/checks/index.ts`.

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
node dist/cli.js --dry-run src   # no API key needed
npm link                         # expose this checkout as the global `lgtm` (symlink to dist/cli.js; rebuild to update)
pnpm gen:skill                   # regenerate skills/lgtm/SKILL.md after changing a check (a test guards drift)
pnpm eval                        # run the labelled corpus against Jev; --offline re-scores, --fit-thresholds refits
```

## License

MIT
