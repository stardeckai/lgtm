# AGENTS.md

lgtm is a CLI that sends each test block to TypeSafe's Jev model with a fan-out of yes/no questions (the checks)
and reports the ones that come back confident. Read `README.md` first; this file is what the README does not say.

## Motivation and context

- **The bug class.** A passing suite proves the code does what the tests assert, not that it works. The failure
  lgtm exists for is the cross-component contract that every unit test mocked away: a write to entity A, a read
  from entity B, both sides faked to agree. Mocks make that class invisible by construction. The highest-risk part
  of a change usually has the least coverage, because pure logic is easy to test and gets tested.
- **Why a model, not more lint rules.** The mechanical smells (bare `toBeDefined`, unawaited promises, `retry:`)
  belong in ESLint and are out of scope here. lgtm covers the judgment calls an AST cannot make: reimplemented
  logic, the mocked module being the seam under test, the missing refusal path, setup that dwarfs the assertion.
- **Why Jev.** It returns a calibrated probability per yes/no question, output tokens are free, input is $0.042 per
  million, and a request takes well under a second. That makes fifteen questions per test block on every PR
  affordable. The trade-off, confirmed by the evals: Jev is precise but conservative and answers crisp, locally
  verifiable questions far better than holistic ones. Every check is therefore written as a decision procedure
  over named evidence, and thresholds are fitted per check rather than set to a flat 0.8.
- **Context is cheap; send it.** Each request carries the whole test file, the implementation one hop deep, sibling
  test names and the repo's own testing guidelines, budgeted at 100k chars. The model never has to guess at the
  rest of the owl. `--lean` keeps the old 8k-char requests as an escape hatch; on this repo it produced 19 findings where full context produced 2, so never tune thresholds against it.
- **Stance.** lgtm favours few, wide tests with real collaborators and assertions that both sides agree. It dislikes
  isolated tests of trivial primitives, over-mocked tests, and one-off assertions. An audit that deletes tests is a
  success. `contract_integration` is the only class it approves of; the 😐🎯 line reports how much of a suite is that.
- **Origin.** The checks come from a hand-run test-audit skill (map each test to what it proves and what it mocks;
  hunt the seams no test crosses; write the cheapest test that locks each invariant) plus a list of review comments
  a strong reviewer keeps making. The eval corpus was written to give that judgment ground truth: 485 synthetic
  cases with deliberate hard negatives, and 40 anonymized real-world tests.

## Best practices for working here

- Read the check you are touching, its lowest-scoring positives and highest-scoring negatives before rewording
  anything. The misses tell you what the model cannot see; the near-miss negatives tell you what it over-reads.
- One check, one question. If a check needs "and", it is two checks. Put look-alikes that must answer "no" in the
  instructions; that is what hard negatives are for.
- Never trust a number you did not earn on holdout. Train F1 goes up when you overfit; holdout is the tell.
- Prefer a hard negative over another obvious positive when adding cases. Obvious positives all score 0.95 and
  teach nothing.
- Keep the terminal output honest and skimmable: one line per finding, the check's glyph, the probability, the
  blurb. Wit lives in the findings; the README stays dry.
- Costs are printed on every run and estimated before it. If you add context to the state, update the cost table
  and the latency model in `printPlan` from measurements, not guesses.
- Anonymize anything derived from a real repository before it enters `evals/`. The corpus is public.

## Layout

- `src/extract.ts` — Babel AST walk: finds `it`/`test`/`describe` blocks (incl. `.each`, `.only`, `.skip`), returns
  the exact source slice, line range, describe path, file context (imports, `vi.mock`, hooks, top-level helpers) and
  the import specifiers.
- `src/analyze.ts` — `buildStates()` turns test files into per-block states (test code, whole test file with the block
  fenced, one hop of implementation through relative and tsconfig-`paths` imports, sibling test names, repo testing
  guidelines, optional git diff), `fitBudget()` trims to 100k chars, `analyze()` calls `systemOne` with a per-block
  cache and a concurrency pool.
- `src/checks/<category>/<id>.ts` — one file per check: id, emoji, blurb, `instructions`, `criteria`, `threshold`.
  `src/checks/index.ts` registers them in the user-visible order. `src/checks/classes.ts` holds the test-class
  Choice question.
- `src/report.ts` — text (😐 faces, colour), github annotations, json. `src/cli.ts` — flags, plan-then-confirm flow,
  `init` / `key` / `skill` / `clear-cache` subcommands. `src/skill.ts` — the generated Claude Code skill.
- `evals/` — the labelled corpus and runner. `skills/lgtm/SKILL.md` — generated, committed, drift-guarded by a test.

## Rules that are easy to break

- **Changing any check's `instructions`/`criteria`, `TEST_CLASSES`, or the package version invalidates every cached
  answer** (they are part of the cache key). After such a change run the full `pnpm eval` before quoting numbers.
- **Thresholds are fitted, not hand-picked.** `pnpm eval --fit-thresholds --write` rewrites `threshold:` in each check
  file from ALL labelled cases (holdout included; a one-parameter fit cannot overfit): the lowest grid point
  (0.30–0.95) with zero false positives, plus one step of margin; recall is whatever that leaves, because precision
  on real code is the product. Holdout still guards prompt rewrites. Do not edit
  thresholds by hand; refit after changing wording. Fit thresholds last, after prompt changes.
- **Labels never go in fixture `.ts` files.** Ground truth lives only in `expect.json`; the `.ts` files are sent to
  the model verbatim. No comments, names or strings that hint at the smell.
- **Unscored is the default.** A case scores a check only if that id is in its `fire` or `not_fire` list. Do not add
  "obviously also fires" ids unless you would defend the label in review.
- **The check order in `src/checks/index.ts` is user-visible** (`--list-checks`, README, SKILL.md). Keep it stable.
- **`skills/lgtm/SKILL.md` is generated.** Edit `src/skill.ts`, then `pnpm gen:skill`; a test fails on drift.
- **The README `<!-- evals:start/end -->` block is rewritten by the runner.** Edit everything else by hand.
- **`npm link` after `pnpm build`** exposes the checkout as the global `lgtm`. `pnpm link --global` needs `pnpm setup`.
- Do not commit unless asked. Never commit `evals/.cache` or `node_modules/.cache/lgtm`.

## Evals: how to change a check without fooling yourself

1. Read the check's row in `evals/RESULTS.md`, then its lowest-scoring positives and highest-scoring negatives under
   `evals/cases/<id>/` (probabilities are in `evals/results/<id>/*.json`).
2. Reword `instructions`/`criteria` as a decision procedure: name the evidence in `test_code`/`implementation`/
   `sibling_tests`, state the yes/no boundary, list the look-alikes that must be "no". Phrase so higher = smell present.
3. `pnpm eval --only <id>` (live, cents) then `pnpm eval --offline --fit-thresholds` and read train and holdout for
   that row. Holdout (~20%, stratified by slug hash) is a sanity check, not a precise number.
4. Append the attempt to `evals/iterations.json` (`{check, variant, instructions, train_f1, holdout_f1, fitted_t, kept}`).
   Cap yourself at four variants per check; more is holdout leakage.
5. Keep the variant with the best train F1 whose holdout did not drop; restore the baseline text otherwise.
6. When all wording is final: `pnpm eval` (full, ~$0.07), `pnpm eval --fit-thresholds --write`, `pnpm eval --offline`,
   `pnpm gen:skill`, `pnpm typecheck && pnpm test && pnpm build`.

Dogfood cases (`evals/cases/dogfood/`) are hard negatives taken from this repo's own tests: `expect.json` carries
`"test": "src/x.test.ts::exact test name"` instead of fixture files, and the runner builds the exact state the CLI would send.
They exist because the synthetic negatives were too easy: the first `lgtm src` self-run produced 19 false
positives that the corpus had never seen, and refitting on them raised three thresholds. When a self-run
flags a test you judge a keeper, add it here (one dir per test, `fire: []`, `not_fire: [the check ids]`, a real
`why`), re-run `pnpm eval`, refit. Never add a dogfood case for a test you have not actually read.

Adding cases: copy the layout of an existing case dir (`case.test.ts` importing `./impl`, `impl.ts`, `expect.json`
with `fire`, `not_fire`, `class`, `why`). Diff checks add `before/` and `after/`; the top-level files equal `after/`.
Extra `it()` blocks after the first become `sibling_tests` (names only). Aim for hard negatives, not more obvious
positives. Real-world cases go under `realworld/` and must be anonymized: no product, customer, org or person names.

Class rule (`expect.json.class`): `pure_logic` = one unit exercised directly (fakes only at true external edges:
clock, random, HTTP, third-party or vendor-facing gateway, filesystem); `mocked_seam_unit` = a first-party
collaborator is faked; `contract_integration` = two or more real first-party components run together and the
assertion depends on their agreeing.

## What the numbers mean

Jev is precise and conservative: on this corpus the ranking is good but the raw probabilities sit low, which is why
thresholds are per check (0.30–0.85) rather than a flat 0.8. Crisp, locally verifiable questions score ~0.97 F1;
holistic questions only work once rewritten as procedures. `regression-does-not-distinguish` has too few diff cases
for its holdout number to mean much. A check that cannot separate on holdout after four iterations should be demoted
to `--verbose` only, not shipped as a default.

## Verification before handing back

`pnpm typecheck && pnpm test && pnpm build`, `pnpm eval --offline` still loads every case, and for anything touching
`src/analyze.ts` or `src/cli.ts` a live `lgtm --dry-run <some test dir>` plus one `lgtm --yes <one test file>` from a
different repo (tsconfig `paths` aliases only show up there).
