# lgtm eval results

544 labelled cases (synthetic + anonymized real-world) · 1175 scored (check, case) pairs · model `jev-1.13.0`

Split: 426 train · 118 holdout.

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 38 | 33 | 0.60 | 1.00/0.59/0.74 | 1.00/0.64/0.78 | 0.97/0.74/0.84 | 0.86 @ 0.19 |
| `vacuous-assertion` | 28 | 131 | 0.35 | 1.00/0.90/0.95 | 1.00/1.00/1.00 | 1.00/0.86/0.92 | 0.98 @ 0.29 |
| `assertion-weaker-than-name` | 42 | 17 | 0.60 | 1.00/0.94/0.97 | 1.00/0.89/0.94 | 0.98/0.95/0.96 | 0.98 @ 0.58 |
| `reimplements-logic` | 19 | 171 | 0.90 | 1.00/0.60/0.75 | 1.00/0.75/0.86 | 0.83/1.00/0.90 | 0.97 @ 0.82 |
| `mocks-seam-under-test` | 18 | 84 | 0.70 | 1.00/0.71/0.83 | 1.00/0.75/0.86 | 0.89/0.94/0.92 | 1.00 @ 0.48 |
| `mock-mirrors-implementation` | 15 | 10 | 0.35 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 1.00 @ 0.51 |
| `tests-calls-not-outcomes` | 19 | 35 | 0.35 | 1.00/0.81/0.90 | 1.00/1.00/1.00 | 1.00/0.74/0.85 | 0.94 @ 0.23 |
| `tests-internals` | 17 | 25 | 0.75 | 1.00/0.85/0.92 | 1.00/1.00/1.00 | 0.94/1.00/0.97 | 0.96 @ 0.62 |
| `setup-dominates` | 17 | 25 | 0.95 | 1.00/0.38/0.56 | 1.00/0.25/0.40 | 0.61/1.00/0.76 | 0.96 @ 0.86 |
| `broad-snapshot` | 15 | 24 | 0.45 | 1.00/0.50/0.67 | 1.00/1.00/1.00 | 1.00/0.47/0.64 | 1.00 @ 0.30 |
| `swallowed-error-as-success` | 16 | 40 | 0.70 | 1.00/0.92/0.96 | 1.00/0.75/0.86 | 0.68/0.94/0.79 | 0.96 @ 0.70 |
| `impossible-fixture` | 16 | 33 | 0.65 | 1.00/0.83/0.91 | 1.00/1.00/1.00 | 0.88/0.94/0.91 | 0.91 @ 0.67 |
| `happy-path-only-of-risky-boundary` | 18 | 53 | 0.65 | 1.00/0.71/0.83 | 1.00/0.75/0.86 | 0.94/0.89/0.91 | 0.92 @ 0.59 |
| `trivial-primitive` | 18 | 87 | 0.80 | 1.00/0.86/0.92 | 1.00/1.00/1.00 | 0.69/1.00/0.82 | 1.00 @ 0.56 |
| `over-mocked` | 16 | 43 | 0.80 | 1.00/0.92/0.96 | 1.00/0.75/0.86 | 0.94/1.00/0.97 | 1.00 @ 0.75 |
| `regression-does-not-distinguish` | 15 | 11 | 0.35 | 1.00/0.75/0.86 | 1.00/0.33/0.50 | 1.00/0.60/0.75 | 0.96 @ 0.19 |
| `changed-in-lockstep` | 16 | 10 | 0.70 | 1.00/1.00/1.00 | 1.00/1.00/1.00 | 0.73/1.00/0.84 | 1.00 @ 0.72 |

Holdout is one stratified draw per case, ~20% (118); with ~3 held-out positives per check its numbers are a sanity check against overfitting, not a precise estimate.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 465/544 (0.85) · holdout: 104/118 (0.88).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 338 | 43 | 1 |
| **mocked_seam_unit** | 1 | 74 | 3 |
| **contract_integration** | 21 | 10 | 53 |

## Misses (labelled fire, p below the check's own threshold)

- `broad-snapshot/02-api-response-inline` · `broad-snapshot` · p=0.40 · the whole serialized envelope is recorded when the named behavior is the single null next link, so any attribute change re-records the block
- `broad-snapshot/04-receipt-email-html` · `broad-snapshot` · p=0.44 · an entire HTML document with inline styles and class names is pinned for a claim about one arithmetic cell, so any markup edit forces a re-record
- `broad-snapshot/06-openapi-paths` · `broad-snapshot` · p=0.41 · forty lines of generated document are pinned for one claim about a path key, so the shared response and security blocks drown the behavior under test
- `broad-snapshot/10-editor-state-serialization` · `broad-snapshot` · p=0.32 · the whole serialized document, cursor and word counts are pinned so the one defaulted boolean the name is about will be re-recorded along with everything else
- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.30 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `broad-snapshot/13-query-plan-shape` · `broad-snapshot` · p=0.34 · the entire plan with per-step row estimates and a derived cost is pinned when the named behavior is only which step comes first
- `happy-path-only-of-risky-boundary/07-reserve-inventory-optimistic-lock` · `happy-path-only-of-risky-boundary` · p=0.64 · the version column exists to reject a second concurrent reservation built on a stale read, and every block passes the current version
- `happy-path-only-of-risky-boundary/10-coupon-redemption` · `happy-path-only-of-risky-boundary` · p=0.22 · the siblings cover expiry and a second customer, but the once-per-customer refusal — the same customer redeeming twice — is never exercised
- `happy-path-only-of-risky-boundary/12-schedule-shift-overlap` · `happy-path-only-of-risky-boundary` · p=0.26 · the siblings cover a backwards shift and two shifts that do not touch, but nothing ever double-books the same staff member, which is the clash the roster exists to refuse
- `happy-path-only-of-risky-boundary/13-role-downgrade-last-owner` · `happy-path-only-of-risky-boundary` · p=0.59 · the sibling covers an unknown member, but nothing demotes the only owner, which is the refusal that keeps an organisation from locking everyone out
- `happy-path-only-of-risky-boundary/14-queue-visibility-timeout` · `happy-path-only-of-risky-boundary` · p=0.59 · redelivery after the visibility window and the move to the dead-letter list on the fourth receive are the risky paths, and every block here acks or drains on the first receive
- `impossible-fixture/15-document-revision-diff` · `impossible-fixture` · p=0.27 · append always numbers revisions contiguously, so a log that jumps from revision 1 to revision 4 — and therefore has no revision 2 to compare against — is a history the editor cannot write
- `mocks-seam-under-test/11-upload-checksum-among-mocks` · `mocks-seam-under-test` · p=0.67 · the clock, metrics and logger fakes are fair, but the store's checksum is also faked, so the local-versus-remote digest comparison the test names can never disagree
- `mocks-seam-under-test/14-idempotency-key-store` · `mocks-seam-under-test` · p=0.63 · the deduplication depends on the store remembering the first write, and the store is a mock scripted to return the stored response whether or not anything was written
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.57 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `over-mocked/04-document-export` · `would-pass-if-broken` · p=0.51 · all four collaborators are stubs and the asserted url is the stub's own return, so a wrong storage key passes
- `over-mocked/07-self-mocked-helpers` · `over-mocked` · p=0.79 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/13-sync-service-class` · `over-mocked` · p=0.75 · the sheet reader, the mapper that decides which rows survive and the store are all stubs kept consistent by hand
- `realworld/02-reserved-config-key-allows` · `tests-calls-not-outcomes` · p=0.31 · the stubbed insert always resolves to an object so toBeDefined accepts anything, and nothing checks that the key, the encrypted value or the targets actually reached the write
- `realworld/03-rate-limit-try-catch` · `swallowed-error-as-success` · p=0.11 · nothing forces the catch block to run, so a client that returned normally on a 429 instead of throwing would leave this test green with zero assertions executed
- `realworld/05-duplicate-workspace-roles` · `setup-dominates` · p=0.86 · eight collaborators covering the whole duplication path are stubbed and forty lines of setup lead to one not-called assertion, so nothing about the copied app, the repository fork or the remapped role grants could fail here
- `realworld/15-merge-commit-protocol` · `mocks-seam-under-test` · p=0.48 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `realworld/15-merge-commit-protocol` · `tests-calls-not-outcomes` · p=0.07 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `realworld/23-invoice-snapshot-freshness` · `setup-dominates` · p=0.85 · thirty lines of fingerprint, currency, plan and savings fixture feed a single not.toThrow, and the only field the gate reads is expiresAt
- `realworld/24-document-schema-content-hash` · `reimplements-logic` · p=0.82 · the expected hash is produced by calling the same hashing function the code under test calls, so any change to canonicalization or digest keeps both sides equal
- `realworld/26-receipt-total-lines` · `reimplements-logic` · p=0.65 · every expected column is produced by the same formatter the renderer uses and the grand total is recomputed in the test with the production arithmetic, so a wrong separator or a flipped discount sign agrees on both sides
- `realworld/31-gateway-webhook-other-events` · `would-pass-if-broken` · p=0.53 · the handler returns undefined on every path, so dropping the event-type guard and settling the seeded invoice would leave this assertion green
- `realworld/32-party-summary-partial-row` · `impossible-fixture` · p=0.51 · the cast builds a booking with no id, no createdAt and no attendees array at all, a row the type and the writer never produce, and the branch it reaches depends on that missing array
- `realworld/33-consent-evidence-binding` · `mocks-seam-under-test` · p=0.64 · the consent store whose write is the behaviour the name claims is itself the mock, so nothing checks that evidence is actually recorded against the booking
- `realworld/34-status-dictionary-coverage` · `vacuous-assertion` · p=0.20 · swapping every invoice label for a shipment one satisfies known, not-the-raw-key, no-underscore and non-empty, so the loop never pins which label belongs to which status
- `realworld/35-slot-capacity-positive` · `vacuous-assertion` · p=0.29 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `realworld/35-slot-capacity-positive` · `would-pass-if-broken` · p=0.59 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.12 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/10-zero-decimal-currency` · `regression-does-not-distinguish` · p=0.19 · the fix is about JPY having no minor units, and every row in the table is USD or EUR, which the pre-fix hard-coded two decimals already formatted correctly
- `regression-does-not-distinguish/12-replay-window-narrowed` · `regression-does-not-distinguish` · p=0.24 · the tolerance moved from 600 to 300 seconds and the test only uses ages of 60 and 1000 seconds, which fall the same side of both limits
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.32 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.20 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.12 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.37 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `reimplements-logic/01-invoice-line-tax` · `reimplements-logic` · p=0.87 · the expected total is produced by the same reduce-and-round expression the implementation uses, so a wrong rounding rule would be wrong identically on both sides
- `reimplements-logic/06-inventory-reorder-point` · `reimplements-logic` · p=0.87 · the safety-stock square-root formula is written out a second time in the test, so an error in the formula is invisible to the assertion
- `reimplements-logic/09-shipping-weight-tiers` · `reimplements-logic` · p=0.88 · the file-level priceFor helper is a line-for-line copy of the pricing function, so the assertion compares the implementation with itself
- `reimplements-logic/10-currency-rounding-helper` · `reimplements-logic` · p=0.87 · the expected payouts are produced by calling the same rounding helper the implementation calls with the same basis-point arithmetic, so a broken half-even rule passes
- `reimplements-logic/12-schedule-next-run` · `reimplements-logic` · p=0.87 · the expected instant is derived with the same ceil-of-elapsed-steps arithmetic and the same strictly-after nudge the scheduler uses
- `setup-dominates/01-feature-flag-bucket` · `setup-dominates` · p=0.94 · the organization, subscription, member list and audit trail are never read by the one assertion, which needs only a flag and a user id
- `setup-dominates/02-order-confirmation-locale` · `setup-dominates` · p=0.94 · the catalogue, promotions, loyalty, shipment and payment fixtures feed nothing the assertion reads, which is the country code and the order id
- `setup-dominates/03-warehouse-reservation-count` · `setup-dominates` · p=0.94 · carriers, inbound shipments, cycle counts and two of the three warehouses exist only to pad a test that needs one stock row
- `setup-dominates/05-invoice-pdf-page-size` · `setup-dominates` · p=0.94 · a full seller, buyer, invoice and totals fixture is built so that one string field of the address can be passed to a country lookup
- `setup-dominates/09-payout-batch-currency` · `setup-dominates` · p=0.93 · KYC records, bank accounts, fee schedules and four transfers are built for an assertion that reads one string copied straight from the merchant row
- `setup-dominates/10-thread-title-truncation` · `setup-dominates` · p=0.94 · seventeen of the eighteen messages plus attachments, reactions and read receipts are irrelevant to a title taken from the first message alone
- `setup-dominates/12-permission-denied-reason` · `setup-dominates` · p=0.94 · role definitions, a resource tree, memberships and generated audit entries are never consulted by an assertion that passes two role literals and a boolean
- `setup-dominates/13-tracking-url-template` · `setup-dominates` · p=0.93 · packages, scan events, recipient and customs data pad a shipment fixture whose only two used fields are the carrier code and the tracking number
- `setup-dominates/15-index-analyzer-name` · `setup-dominates` · p=0.94 · an index mapping, thirty documents, a bulk body and aggregation definitions surround a two-argument call into a lookup table
- `swallowed-error-as-success/01-duplicate-signup-try-catch` · `would-pass-if-broken` · p=0.29 · if the duplicate check disappeared the second register would return an account, the catch would never run and the test would still be green
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.61 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `tests-calls-not-outcomes/13-migration-ordering` · `would-pass-if-broken` · p=0.28 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-calls-not-outcomes/15-session-revocation` · `tests-calls-not-outcomes` · p=0.23 · expect.any(String) for the session id means revoking the session that was meant to be kept still passes
- `tests-calls-not-outcomes/15-session-revocation` · `would-pass-if-broken` · p=0.36 · expect.any(String) for the session id means revoking the session that was meant to be kept still passes
- `tests-internals/03-badge-class-names` · `tests-internals` · p=0.65 · only styling class names are asserted while the label and the capped 9+ text the user reads go unchecked
- `tests-internals/04-handler-source-text` · `would-pass-if-broken` · p=0.39 · it greps the function's source text, so an org-wide lookup that leaked members across tenants would still pass
- `tests-internals/10-reducer-dispatch-spy` · `assertion-weaker-than-name` · p=0.58 · it asserts the sequence of internal action types while the reducer that enforces the four-seat limit never runs
- `tests-internals/13-permission-table-shape` · `tests-internals` · p=0.62 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `tests-internals/13-permission-table-shape` · `would-pass-if-broken` · p=0.21 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `trivial-primitive/09-session-lookup-wrapper` · `trivial-primitive` · p=0.66 · find is a one-line wrapper over Map.get with a null fallback, and every activeUserId test exercises it already
- `trivial-primitive/14-tasks-by-due-date` · `trivial-primitive` · p=0.56 · a one-line sort on an already-sortable ISO date string, and any test of the upcoming column would show tasks coming out in the wrong order
- `would-pass-if-broken/03-archived-documents` · `would-pass-if-broken` · p=0.58 · no fixture document is archived, so removing the archived filter changes nothing about the exact id list this asserts
- `would-pass-if-broken/04-retry-backoff` · `would-pass-if-broken` · p=0.39 · only the first delay and the array length are pinned, so a schedule that never doubles and never caps still satisfies both
- `would-pass-if-broken/05-tenant-ticket-listing` · `would-pass-if-broken` · p=0.19 · every seeded ticket belongs to acme, so dropping the tenant filter entirely leaves the asserted id list unchanged
- `would-pass-if-broken/09-inventory-reservation` · `would-pass-if-broken` · p=0.33 · 3 units are requested against 10 available, so replacing the clamp with a plain assignment produces the same asserted object
- `would-pass-if-broken/10-rate-limit-window` · `would-pass-if-broken` · p=0.51 · only three calls are made against a limit of five, so a limiter that never resets its window returns true for all three anyway
- `would-pass-if-broken/12-next-business-day` · `would-pass-if-broken` · p=0.38 · 2026-03-03 is a Tuesday so the next day is already a weekday, and removing the weekend skip still yields 2026-03-04
- `would-pass-if-broken/14-upload-content-type` · `would-pass-if-broken` · p=0.20 · the file is also named .png, so removing the magic-byte scan entirely still resolves image/png through the extension table

## False positives (labelled not_fire, p at or above the check's own threshold)

None.

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

### `would-pass-if-broken`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.77 | 0.62 | no |
| branch-only procedure | 0.65 | 0.62 | no |
| break-and-rerun procedure | 0.86 | 0.76 | no |
| break-and-rerun + exact-output-is-no | 0.81 | 0.86 | yes |
| break-and-rerun + exact-output criteria | 0.88 | 0.78 | no |

### `reimplements-logic`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.75 | 1.00 | no |
| stored-artifact-first (expected-side framing) | 0.57 | 0.67 | no |
| drift-guard exemption + input-or-expectation recomputation | 0.97 | 1.00 | yes |

### `trivial-primitive`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.89 | 0.89 | yes |
| body-shape decision procedure | 0.90 | 0.89 | no |
| +constant table, +inputs-built-by-real-code | 0.89 | 0.89 | no |
| +enum-constant carve-out, +validates | 0.80 | 0.57 | no |
| v1 + constant-switch sentence | 0.86 | 0.89 | no |

## Cost

2124397 input tokens ≈ $0.0892 for the full corpus (544 cases, ~3905 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
