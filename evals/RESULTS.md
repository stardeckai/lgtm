# lgtm eval results

525 labelled cases (synthetic + anonymized real-world) · 1156 scored (check, case) pairs · model `jev-1.13.0`

Split: 411 train · 114 holdout.

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 38 | 25 | 0.35 | 1.00/0.85/0.92 | 1.00/1.00/1.00 | 1.00/0.68/0.81 | 0.92 @ 0.35 |
| `vacuous-assertion` | 28 | 129 | 0.30 | 1.00/0.95/0.98 | 1.00/1.00/1.00 | 1.00/0.86/0.92 | 0.98 @ 0.20 |
| `assertion-weaker-than-name` | 42 | 16 | 0.55 | 1.00/0.97/0.98 | 1.00/0.89/0.94 | 1.00/0.95/0.98 | 0.98 @ 0.56 |
| `reimplements-logic` | 19 | 169 | 0.75 | 1.00/0.93/0.97 | 1.00/1.00/1.00 | 0.95/0.95/0.95 | 0.97 @ 0.75 |
| `mocks-seam-under-test` | 18 | 84 | 0.60 | 1.00/0.86/0.92 | 1.00/1.00/1.00 | 0.89/0.94/0.92 | 0.97 @ 0.49 |
| `mock-mirrors-implementation` | 15 | 10 | 0.50 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00 @ 0.51 |
| `tests-calls-not-outcomes` | 19 | 34 | 0.30 | 1.00/0.88/0.93 | 1.00/1.00/1.00 | 1.00/0.74/0.85 | 0.97 @ 0.24 |
| `tests-internals` | 17 | 24 | 0.60 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00 @ 0.62 |
| `setup-dominates` | 17 | 23 | 0.85 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 0.68/1.00/0.81 | 1.00 @ 0.85 |
| `broad-snapshot` | 15 | 24 | 0.30 | 1.00/0.92/0.96 | 0.75/1.00/0.86 | 1.00/0.60/0.75 | 0.96 @ 0.28 |
| `swallowed-error-as-success` | 16 | 40 | 0.75 | 1.00/0.83/0.91 | 1.00/0.75/0.86 | 0.75/0.94/0.83 | 0.96 @ 0.67 |
| `impossible-fixture` | 16 | 33 | 0.60 | 1.00/0.83/0.91 | 1.00/1.00/1.00 | 0.88/0.94/0.91 | 0.91 @ 0.60 |
| `happy-path-only-of-risky-boundary` | 18 | 52 | 0.55 | 1.00/0.86/0.92 | 1.00/1.00/1.00 | 1.00/0.89/0.94 | 0.92 @ 0.59 |
| `trivial-primitive` | 19 | 85 | 0.65 | 1.00/0.87/0.93 | 0.80/1.00/0.89 | 0.79/1.00/0.88 | 0.94 @ 0.53 |
| `over-mocked` | 16 | 43 | 0.75 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 0.94/1.00/0.97 | 1.00 @ 0.76 |
| `regression-does-not-distinguish` | 15 | 11 | 0.45 | 1.00/0.75/0.86 | 1.00/0.33/0.50 | 1.00/0.60/0.75 | 1.00 @ 0.15 |
| `changed-in-lockstep` | 16 | 10 | 0.70 | 1.00/1.00/1.00 | 0.80/1.00/0.89 | 0.73/1.00/0.84 | 1.00 @ 0.72 |

Holdout is one stratified draw per case, ~20% (114); with ~3 held-out positives per check its numbers are a sanity check against overfitting, not a precise estimate.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 453/525 (0.86) · holdout: 99/114 (0.87).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 326 | 42 | 0 |
| **mocked_seam_unit** | 0 | 73 | 2 |
| **contract_integration** | 20 | 8 | 54 |

## Misses (labelled fire, p below the check's own threshold)

- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.28 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `happy-path-only-of-risky-boundary/10-coupon-redemption` · `happy-path-only-of-risky-boundary` · p=0.28 · the siblings cover expiry and a second customer, but the once-per-customer refusal — the same customer redeeming twice — is never exercised
- `happy-path-only-of-risky-boundary/12-schedule-shift-overlap` · `happy-path-only-of-risky-boundary` · p=0.26 · the siblings cover a backwards shift and two shifts that do not touch, but nothing ever double-books the same staff member, which is the clash the roster exists to refuse
- `impossible-fixture/15-document-revision-diff` · `impossible-fixture` · p=0.30 · append always numbers revisions contiguously, so a log that jumps from revision 1 to revision 4 — and therefore has no revision 2 to compare against — is a history the editor cannot write
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.56 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `realworld/03-rate-limit-try-catch` · `swallowed-error-as-success` · p=0.11 · nothing forces the catch block to run, so a client that returned normally on a 429 instead of throwing would leave this test green with zero assertions executed
- `realworld/15-merge-commit-protocol` · `mocks-seam-under-test` · p=0.49 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `realworld/15-merge-commit-protocol` · `tests-calls-not-outcomes` · p=0.07 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `realworld/26-receipt-total-lines` · `reimplements-logic` · p=0.41 · every expected column is produced by the same formatter the renderer uses and the grand total is recomputed in the test with the production arithmetic, so a wrong separator or a flipped discount sign agrees on both sides
- `realworld/30-icon-key-registry` · `trivial-primitive` · p=0.53 · the code is a constant lookup with a name-hint fallback, and any test that renders a session card with a chosen icon already covers this precedence
- `realworld/32-party-summary-partial-row` · `impossible-fixture` · p=0.52 · the cast builds a booking with no id, no createdAt and no attendees array at all, a row the type and the writer never produce, and the branch it reaches depends on that missing array
- `realworld/34-status-dictionary-coverage` · `vacuous-assertion` · p=0.20 · swapping every invoice label for a shipment one satisfies known, not-the-raw-key, no-underscore and non-empty, so the loop never pins which label belongs to which status
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.13 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/10-zero-decimal-currency` · `regression-does-not-distinguish` · p=0.18 · the fix is about JPY having no minor units, and every row in the table is USD or EUR, which the pre-fix hard-coded two decimals already formatted correctly
- `regression-does-not-distinguish/12-replay-window-narrowed` · `regression-does-not-distinguish` · p=0.28 · the tolerance moved from 600 to 300 seconds and the test only uses ages of 60 and 1000 seconds, which fall the same side of both limits
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.32 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.17 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.15 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.32 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.64 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `swallowed-error-as-success/15-empty-list-for-unknown-tenant` · `swallowed-error-as-success` · p=0.67 · the catch logs and returns the same empty array, so a filter that crashed would look exactly like the tenant scoping this test is named for
- `tests-calls-not-outcomes/15-session-revocation` · `tests-calls-not-outcomes` · p=0.24 · expect.any(String) for the session id means revoking the session that was meant to be kept still passes
- `tests-internals/13-permission-table-shape` · `would-pass-if-broken` · p=0.27 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `trivial-primitive/14-tasks-by-due-date` · `trivial-primitive` · p=0.58 · a one-line sort on an already-sortable ISO date string, and any test of the upcoming column would show tasks coming out in the wrong order
- `would-pass-if-broken/05-tenant-ticket-listing` · `would-pass-if-broken` · p=0.29 · every seeded ticket belongs to acme, so dropping the tenant filter entirely leaves the asserted id list unchanged
- `would-pass-if-broken/13-document-permissions` · `would-pass-if-broken` · p=0.25 · the admin in the fixture is also the owner, so the owner branch returns true first and deleting the admin rule changes nothing
- `would-pass-if-broken/14-upload-content-type` · `would-pass-if-broken` · p=0.22 · the file is also named .png, so removing the magic-byte scan entirely still resolves image/png through the extension table

## False positives (labelled not_fire, p at or above the check's own threshold)

- `changed-in-lockstep/20-result-gains-breakdown` · `changed-in-lockstep` · p=0.71 · both totals are unchanged at 31500 and 13500; only the return shape changed, with two component fields added that sum to the same total
- `setup-dominates/02-order-confirmation-locale` · `trivial-primitive` · p=0.88 · the catalogue, promotions, loyalty, shipment and payment fixtures feed nothing the assertion reads, which is the country code and the order id
- `vacuous-assertion/13-webhook-envelope` · `broad-snapshot` · p=0.42 · expect.any accepts failed, delivered or any other string in the status the name pins to queued

## Iterations

Prompt-rewrite history from `evals/iterations.json`.

### `happy-path-only-of-risky-boundary`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.60 | 0.40 | no |
| enumerate-branches-procedure | 0.88 | 0.86 | no |
| risk-ranked-branches | 0.88 | 0.67 | no |
| procedure+self-refusal-negative | 0.92 | 0.86 | yes |
| +allowed-side-of-same-rule | 0.92 | 1.00 | no |

### `mocks-seam-under-test`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.23 | 0.40 | no |
| ownership-of-named-behaviour | 0.80 | 0.67 | no |
| ownership + canned-read/called-only arms | 0.84 | 1.00 | no |
| + hands-back-the-compared-value arm | 0.89 | 1.00 | yes |
| + called-with-right-arguments (rejected) | 0.80 | 0.67 | no |

### `over-mocked`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.59 | 0.67 | no |
| collaborators-of-impl + first-party-vs-external-edge | 0.96 | 0.86 | yes |

### `swallowed-error-as-success`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.15 | 0.00 | no |
| decision-procedure-4-steps | 0.86 | 0.67 | no |
| v2-constant-fallback-and-rigged-mock | 0.91 | 0.86 | no |
| v3-names-the-failure-negatives | 0.96 | 0.86 | yes |
| v4-first-match-wins | 0.96 | 0.75 | no |

### `setup-dominates`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.38 | 0.40 | no |
| inventory-vs-read | 1.00 | 1.00 | yes |
| inventory-vs-read + discriminator clause | 1.00 | 1.00 | no |

### `tests-internals`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.56 | 1.00 | no |
| contract-surface-vs-peeking | 1.00 | 1.00 | yes |

## Cost

1627010 input tokens ≈ $0.0683 for the full corpus (525 cases, ~3099 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
