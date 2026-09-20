# 😐👍...lgtm?

Prove that your tests actually test something. Powered by Jev and your own TypeSafe API key.

<img src="public/findings.png" alt="lgtm findings: file:line, the check, its probability and a one-line reason">

Your agent wrote 40 tests. They're all green. What do they prove? lgtm reads every test block with its
implementation and tells you which ones are useless.

It runs on [Jev by TypeSafe](https://typesafe.ai), with your own `TYPESAFE_API_KEY`.

With this, you can prove that your agent actually wrote code that actually works, so you can say it lgtm 😐👍.

_Evaluated and hill-climbed on real live apps built by [Stardeck](https://stardeck.ai): 15,000+ real test blocks scored,
262 each read against its implementation and labelled, every check's threshold fitted so that when lgtm points at a test, the test is
worth your time._

## What you get

- the `lgtm` CLI: run it on a file, a directory or `--diff`, in your terminal or in CI
- a `/lgtm` skill for your coding agents, so the agent that wrote the tests runs the audit and fixes what it finds
- an `/actually-test` skill: write the tests the change needs, prove them red, then iterate with lgtm until they pass

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
lgtm init                    # paste your API key, then install the /lgtm and /actually-test skills
```

It asks for your TypeSafe API key (get one at <https://typesafe.ai>), then asks whether to install the
`/lgtm` and `/actually-test` skills with `npx skills`.

The key lands in `~/.config/lgtm/config.json` (mode 0600); `TYPESAFE_API_KEY` in the environment wins over it.

Skip the prompts with `--skill <where>`:

| `--skill` | |
|---|---|
| `global` | every project, via the `skills` CLI (what `--yes` picks) |
| `project` | this project only, via the `skills` CLI |
| `claude` | write `~/.claude/skills/{lgtm,actually-test}/SKILL.md` directly, no `npx` |
| `none` | skip them |

If the `skills` CLI can't run, `init` falls back to writing the Claude Code skills itself.

Running `lgtm` before setup exits with `😐✋  No API key. Run: lgtm init`.

## Use

```sh
lgtm .                     # every *.test.* / *.spec.* file under a directory (a path is required)
lgtm src/user.test.ts      # one file, or a directory
lgtm --diff origin/main    # only tests changed vs a base, with the diff as evidence
lgtm --diff                # just what you're working on: changed and new tests, plus tests of changed code, vs the default branch
lgtm --dry-run src         # only the plan: files, estimated cost and runtime; no key needed
```

Every run starts with that plan and asks `Run? [Y/n]`. Outside a terminal (CI, an agent) it stops after the plan
unless you pass `--yes`.

<img src="public/plan.png" alt="lgtm plan: files, estimated cost and runtime, then a confirmation prompt">

```sh
lgtm . --yes --format json # non-interactive
```

For a one-off run without installing: `npx @stardeckai/lgtm --dry-run src`.

```
test/payment.test.ts:42  "rejects expired cards"
  😐👏 mocks-seam-under-test 0.93 — The collaborator that decides this behaviour is a mock, so the test only proves the mock works.

test/refund.test.ts:17  "refunds a captured charge"
  😐🤏 swallowed-error-as-success 0.88 — The test stays green whether the error is caught, logged, or never thrown; it never pins the specific failure.

😐🫵  2 tests prove nothing.
4 contract-integration · 19 mocked-seam · 8 pure-logic

98120 input tokens used ≈ $0.0041 ($0.0001 per test)
9.8s (0.3s per test)
```

Four faces, one per family: `😐🤏` the assertion proves this much, `😐👏` you tested the mock, `😐🤌` what
exactly are we doing here, `😐🫸` do not merge this. Colour is severity (red at 0.9 and above, yellow at or over
the check's threshold, dim for `--verbose` suspects). The verdict is one line, `😐👍  N tests. fine. allegedly.`
or `😐🫵  N tests prove nothing.` `--format github` and `--format json` stay plain.

### Flags

| flag | |
|---|---|
| `--diff [base]` | only the tests your change touches, with the diff in the state. Without a base it uses the repo's default branch (`origin/HEAD`, else `origin/main`, else `main`, else `master`), and always compares against `git merge-base <base> HEAD`, so a branch that is behind does not report the base's own commits. Counts uncommitted and untracked files, keeps only the test blocks that overlap a changed line, and adds any test whose imports include a changed source file (all of its blocks). The two diff checks only run on blocks the diff touched |
| `--diff-all-blocks` | with `--diff`, audit every block of a changed file instead of only the changed ones |
| `--threshold <0..1>` | override every check's threshold |
| `--only <ids,…>` / `--skip <ids,…>` | pick checks |
| `--format text\|github\|json` | `github` emits `::warning` annotations |
| `--concurrency <n>` | parallel requests, default 4 |
| `--no-impl` | don't send implementation source |
| `--ignore <pattern>` | skip paths; repeatable. Also reads `.lgtmignore` in the cwd, one gitignore-style pattern per line (`evals/`, `**/fixtures/**`, `*.stories.test.ts`) |
| `--lean` | send ~2.5x fewer tokens (8k of implementation, no test file or guidelines). Thresholds are calibrated on full context, so expect several times more false positives; only for rate limits or enormous test files |
| `--no-cache` | ignore the answer cache |
| `--fail` | exit 1 when there are findings |
| `--fail-on-error` | exit 1 when a block was skipped by an API error |
| `--classes` | list every test with its class before the findings |
| `--verbose` | also show 0.5-to-threshold findings |
| `--list-checks` | print the checks |

## Why

**Coding agents are prolific test writers and terrible test critics.** They mock whatever is inconvenient,
assert that the mock was called, compute the expected value with the code under test, and hand you a suite
where every line is covered and nothing is verified. A test that checks a trace's name. A test for the thing
you decided not to build. Nobody reads those files. The PR says "added tests" and gets merged.

**The bug that pages you lives in a seam.** One side writes, the other reads, and every unit test mocked at least
one of them to agree. No linter catches that. It's a judgment call, and judgment used to cost a senior engineer's
afternoon per PR.

**Reads like a review, runs like a linter.** Every finding is one test, one smell, one probability, one sentence
you can act on. `😐👏 mocks-seam-under-test` means you tested the mock. `😐👏 reimplements-logic` means the test
and the implementation share the same bug. The summary tells you how much of your suite actually crosses a seam.

**Opinionated by design.** Few wide tests with real collaborators beat a hundred mocked units. Delete with
confidence: a good audit shrinks the suite. And when the suite is clean, it says so.

<img src="public/success.png" alt="lgtm clean run: 36 tests. fine. allegedly.">

**Now it costs a cent.** Jev bills $0.042 per million input tokens and answers in under a second. lgtm shows you
the bill and the runtime before it spends, and caches every answer. Every check holds precision 1.00 on the
held-out slice of the corpus ([`evals/`](evals/RESULTS.md)).

## What lgtm likes

A test that crosses a seam with both sides real and asserts that they agree. That test fails when the
wiring breaks, which is how most things actually break.

It dislikes tests of one-line helpers (any real test of the feature covers them for free), tests that
mock everything except the function name, and one-off assertions that would survive the feature being
deleted. So the summary prints what your suite is made of: `N contract-integration · N mocked-seam ·
N pure-logic`. `--classes` lists every test with its class, which is the number to watch during an audit.
Retiring three unit tests for one wider test that really fails is a win, not a coverage loss.

## Checks

`--format json` adds a `checks` map with a longer explanation and the fix, once per check.

<!-- checks:start -->
| | check | |
|---|---|---|
| 😐&#8288;🤏 | `would-pass-if-broken` | Break the behaviour the name describes and this test still passes; the fixture never reaches it. |
| 😐&#8288;🤏 | `vacuous-assertion` | The assertion accepts almost any output, so it cannot fail for a real bug. |
| 😐&#8288;🤏 | `assertion-weaker-than-name` | The name promises a behaviour the assertions never check. |
| 😐&#8288;👏 | `reimplements-logic` | The expected value is computed with the same logic as production, so both can be wrong together. |
| 😐&#8288;👏 | `mocks-seam-under-test` | The collaborator that decides this behaviour is a mock, so the test only proves the mock works. |
| 😐&#8288;👏 | `mock-mirrors-implementation` | The mock re-encodes the production logic; any implementation that agrees with the copy passes. |
| 😐&#8288;🤏 | `tests-calls-not-outcomes` | It asserts that a function was called, not what happened as a result. |
| 😐&#8288;🤌 | `tests-internals` | It asserts private state, class names or call order instead of observable behaviour; a refactor breaks it, a bug does not. |
| 😐&#8288;🤌 | `setup-dominates` | Most of the setup never reaches the assertion. It is scenery. |
| 😐&#8288;🤏 | `broad-snapshot` | The snapshot pins everything and explains nothing, so it will be re-recorded on the next change. |
| 😐&#8288;🤏 | `swallowed-error-as-success` | The test stays green whether the error is caught, logged, or never thrown; it never pins the specific failure. |
| 😐&#8288;🤌 | `impossible-fixture` | The fixture builds a state production validation could never produce. |
| 😐&#8288;🤌 | `happy-path-only-of-risky-boundary` | The refusal path this code exists for, the one that pages you, has no test here or among its siblings. |
| 😐&#8288;🤌 | `trivial-primitive` | A one-line helper tested in isolation; any real test of the feature that uses it would catch the same break. |
| 😐&#8288;👏 | `over-mocked` | So many collaborators are faked that only glue is left to fail. |
| 😐&#8288;🫸 | `regression-does-not-distinguish` | This regression test also passes on the buggy code, so it does not lock the fix. *(needs `--diff`)* |
| 😐&#8288;🫸 | `changed-in-lockstep` | Implementation and expected values changed together, so the test may only mirror the new behaviour. *(needs `--diff`)* |
<!-- checks:end -->

<!-- evals:start -->
## Evals

The corpus is 506 public + 262 private labelled test cases, synthetic and anonymized real-world, with positives, hard negatives and genuinely good tests. The ground truth is kept in `expect.json` so it never reaches the model.

The 262 private cases come from real Stardeck customer apps and from Stardeck's own codebase, each read against its implementation, labelled, and anonymized. They are scored in these numbers but not published, because anonymization removes names, not shape. The 506 public cases in `evals/cases` reproduce with `pnpm eval` alone.

Scores are at each check's own threshold. 162 of the cases are holdout, never used to fit a threshold or a prompt.

| check | cases | threshold | precision (holdout) | recall (holdout) | precision (all) | recall (all) |
|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 99 | 0.60 | 1.00 | 0.36 | 0.96 | 0.47 |
| `vacuous-assertion` | 179 | 0.70 | 1.00 | 0.63 | 1.00 | 0.69 |
| `assertion-weaker-than-name` | 82 | 0.60 | 1.00 | 0.92 | 0.98 | 0.95 |
| `reimplements-logic` | 204 | 0.85 | 1.00 | 0.50 | 1.00 | 0.67 |
| `mocks-seam-under-test` | 121 | 0.80 | 1.00 | 0.33 | 1.00 | 0.23 |
| `mock-mirrors-implementation` | 36 | 0.60 | 1.00 | 0.50 | 1.00 | 0.83 |
| `tests-calls-not-outcomes` | 74 | 0.65 | 1.00 | 1.00 | 1.00 | 0.87 |
| `tests-internals` | 64 | 0.65 | 1.00 | 0.80 | 1.00 | 0.70 |
| `setup-dominates` | 60 | 0.60 | 1.00 | 1.00 | 1.00 | 0.94 |
| `broad-snapshot` | 51 | 0.35 | 1.00 | 1.00 | 1.00 | 0.94 |
| `swallowed-error-as-success` | 76 | 0.80 | 1.00 | 0.80 | 1.00 | 0.46 |
| `impossible-fixture` | 63 | 0.55 | 1.00 | 1.00 | 1.00 | 0.75 |
| `happy-path-only-of-risky-boundary` | 88 | 0.70 | 1.00 | 0.50 | 1.00 | 0.50 |
| `trivial-primitive` | 122 | 0.85 | 1.00 | 0.71 | 1.00 | 0.66 |
| `over-mocked` | 84 | 0.60 | — | 0.00 | 1.00 | 0.21 |
| `regression-does-not-distinguish` | 26 | 0.35 | 1.00 | 0.33 | 1.00 | 0.67 |
| `changed-in-lockstep` | 26 | 0.75 | 1.00 | 1.00 | 1.00 | 0.88 |

Test class accuracy: 655/768 (0.85) on all cases, 142/162 (0.88) on holdout.

A full cold run of the corpus is about 3,740,225 input tokens ≈ $0.1571 (estimated from the states; the last run spent $0.0152 after cache hits).

Every miss and false positive is listed in [`evals/RESULTS.md`](evals/RESULTS.md). The public cases reproduce with `pnpm eval`.
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

lgtm is advisory by default: it prints findings and exits 0. Fetch enough history for the base ref
(`fetch-depth: 0`) and add `--fail` once the findings are clean enough that you want them blocking.

## Cost

TypeSafe bills $0.042 per million input tokens and nothing for output, so lgtm is cheap enough to run on every PR.
One request per test block. Each state is trimmed to at most 100,000 chars (~25,000 tokens, under TypeSafe's 32k
state limit): the test code, the whole test file with the block fenced, the file's imports and sibling test names,
up to 60,000 chars of the imported implementation (one hop deep) and the test sections of any CLAUDE.md/AGENTS.md
above it. `--lean` cuts that back to an 8,000-char implementation and no test file or guidelines.

| run | blocks | input tokens | cost |
|---|---|---|---|
| a PR touching 20 tests (`--diff`) | 20 | ~100k | ~$0.004 |
| a mid-sized suite | 500 | ~2.5M | ~$0.11 |
| a large monorepo suite | 5,000 | ~25M | ~$1.05 |
| the eval corpus (`pnpm eval`, cold) | 768 | see the Evals section | |

Answers are cached by state hash under `node_modules/.cache/lgtm`, so a re-run after editing one test only pays for
that test. The implementation source is the main cost lever: `--no-impl` cuts the bulk of each request at the price
of weaker `would-pass-if-broken` and `reimplements-logic` answers. Every run prints its input tokens and the
estimated cost.

## Config

The key lives in `~/.config/lgtm/config.json`. `TYPESAFE_API_KEY` in the environment always wins over it.

```sh
lgtm key <new-key>           # swap the saved key; `lgtm key` alone prompts
lgtm usage                   # cost so far: all time, last day, last week, this worktree
lgtm clear-cache             # drop this project's cached answers (node_modules/.cache/lgtm)
lgtm skill                   # (re)install the /lgtm and /actually-test skills, e.g. to add another agent
lgtm init                    # both steps again
```

## Thresholds

Each check has its own threshold, fitted on the eval corpus to the lowest probability that still gives zero
false positives (the `threshold` column above). That trades recall for precision on purpose: a finding should
be worth your time. To see what sits just under the line, run `--verbose`, or `--threshold 0.5 --format json`
on a suite you know well and pick your own number. A check that is consistently wrong for your codebase belongs
in `--skip`.

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
pnpm gen:skill                   # regenerate skills/*/SKILL.md after changing a check or a skill (a test guards drift)
pnpm eval                        # run the labelled corpus against Jev; --offline re-scores, --fit-thresholds refits
```

## License

MIT
