# lgtm eval results

949 labelled cases (521 public + 428 private, synthetic + anonymized real-world) · 1709 scored (check, case) pairs · model `jev-1.13.0`

Split: 689 train · 260 holdout (220 real).

Corpus: 521 public + 428 private labelled cases (449 real), 260 held out (220 real). Each check's threshold is fitted on the train cases to the lowest point that fires on no real negative and keeps precision at or above 0.95, plus one step of margin; recall is what that leaves. Ground truth lives only in `expect.json`, never in the files the model sees. The 428 real cases were harvested by scoring every test block in real codebases, sampling around each threshold, and reading each block against its implementation; they are anonymized and kept private because anonymization removes names, not shape.

## Held out, per check

High-confidence findings sit at or above the check's high-confidence line; all flagged includes the worth-a-look band from the threshold up.

| check | threshold | high-confidence precision/recall | all flagged precision/recall | held-out +/− |
|---|---|---|---|---|
| `would-pass-if-broken` | 0.50 | 1.00/0.12 | 0.90/0.35 | 26/16 |
| `vacuous-assertion` | 0.58 | 1.00/0.37 | 1.00/0.89 | 19/24 |
| `assertion-weaker-than-name` | 0.68 | 0.93/0.87 | 0.93/0.87 | 15/8 |
| `reimplements-logic` | 0.60 | 1.00/0.67 | 1.00/0.83 | 6/22 |
| `mocks-seam-under-test` | 0.84 | —/0.00 | 0.80/0.50 | 8/20 |
| `mock-mirrors-implementation` | 0.60 | 1.00/1.00 | 1.00/1.00 | 1/7 |
| `tests-calls-not-outcomes` | 0.75 | —/0.00 | 1.00/0.50 | 4/19 |
| `tests-internals` | 0.55 | 1.00/0.50 | 1.00/0.50 | 6/14 |
| `setup-dominates` | 0.70 | 1.00/0.67 | 0.75/1.00 | 3/18 |
| `broad-snapshot` | 0.35 | —/— | —/— | 0/7 |
| `swallowed-error-as-success` | 0.75 | 1.00/0.20 | 0.33/0.20 | 5/19 |
| `impossible-fixture` | 0.50 | 1.00/0.50 | 1.00/0.50 | 2/18 |
| `happy-path-only-of-risky-boundary` | 0.65 | 1.00/0.40 | 0.80/0.80 | 5/16 |
| `trivial-primitive` | 0.68 | 0.80/0.62 | 0.85/0.85 | 13/15 |
| `over-mocked` | 0.80 | —/0.00 | 0.75/0.43 | 7/30 |
| `regression-does-not-distinguish` | 0.75 | —/0.00 | 1.00/0.50 | 14/5 |
| `changed-in-lockstep` | 0.90 | 1.00/1.00 | 0.50/1.00 | 1/8 |
| **all** | | 0.94/0.34 | 0.89/0.63 | 135/266 |

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 76 | 45 | 0.50 | 1.00/0.60/0.75 | 0.90/0.35/0.50 | 0.97/0.51/0.67 | 0.93 @ 0.14 |
| `vacuous-assertion` | 51 | 146 | 0.58 | 0.96/0.75/0.84 | 1.00/0.89/0.94 | 0.94/0.90/0.92 | 0.94 @ 0.37 |
| `assertion-weaker-than-name` | 71 | 27 | 0.68 | 0.96/0.89/0.93 | 0.93/0.87/0.90 | 0.87/0.96/0.91 | 0.95 @ 0.60 |
| `reimplements-logic` | 32 | 183 | 0.60 | 0.96/0.92/0.94 | 1.00/0.83/0.91 | 0.91/0.91/0.91 | 0.95 @ 0.47 |
| `mocks-seam-under-test` | 28 | 105 | 0.84 | 0.86/0.60/0.71 | 0.80/0.50/0.62 | 0.51/1.00/0.67 | 0.84 @ 0.71 |
| `mock-mirrors-implementation` | 18 | 28 | 0.60 | 1.00/0.82/0.90 | 1.00/1.00/1.00 | 0.90/1.00/0.95 | 0.97 @ 0.52 |
| `tests-calls-not-outcomes` | 23 | 55 | 0.75 | 1.00/0.84/0.91 | 1.00/0.50/0.67 | 0.88/0.91/0.89 | 0.97 @ 0.50 |
| `tests-internals` | 29 | 45 | 0.55 | 1.00/0.70/0.82 | 1.00/0.50/0.67 | 1.00/0.66/0.79 | 0.98 @ 0.32 |
| `setup-dominates` | 17 | 53 | 0.70 | 1.00/0.71/0.83 | 0.75/1.00/0.86 | 0.70/0.94/0.80 | 0.96 @ 0.63 |
| `broad-snapshot` | 16 | 35 | 0.35 | 1.00/0.94/0.97 | —/—/— | 1.00/0.81/0.90 | 1.00 @ 0.19 |
| `swallowed-error-as-success` | 24 | 59 | 0.75 | 1.00/0.58/0.73 | 0.33/0.20/0.25 | 0.76/0.92/0.83 | 0.90 @ 0.58 |
| `impossible-fixture` | 16 | 60 | 0.50 | 1.00/0.86/0.92 | 1.00/0.50/0.67 | 1.00/0.81/0.90 | 0.92 @ 0.57 |
| `happy-path-only-of-risky-boundary` | 23 | 73 | 0.65 | 1.00/0.61/0.76 | 0.80/0.80/0.80 | 0.74/0.87/0.80 | 0.88 @ 0.52 |
| `trivial-primitive` | 41 | 97 | 0.68 | 0.96/0.82/0.88 | 0.85/0.85/0.85 | 0.76/1.00/0.86 | 0.96 @ 0.61 |
| `over-mocked` | 24 | 80 | 0.80 | 1.00/0.24/0.38 | 0.75/0.43/0.55 | 0.68/0.79/0.73 | 0.79 @ 0.46 |
| `regression-does-not-distinguish` | 44 | 34 | 0.75 | 1.00/0.50/0.67 | 1.00/0.50/0.67 | 0.97/0.84/0.90 | 0.92 @ 0.42 |
| `changed-in-lockstep` | 17 | 34 | 0.90 | 1.00/0.63/0.77 | 0.50/1.00/0.67 | 0.71/1.00/0.83 | 0.94 @ 0.75 |

Holdout is the test set: every 2nd real case and every 10th synthetic one (260, 220 real). Thresholds are fitted on train only and prompts are never tuned against holdout, so its numbers are the ones to trust; with a handful of held-out positives per check they are still coarse.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 792/949 (0.83) · holdout: 213/260 (0.82).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 536 | 68 | 39 |
| **mocked_seam_unit** | 1 | 151 | 7 |
| **contract_integration** | 24 | 18 | 105 |

## Misses (labelled fire, p below the check's own threshold)

- `assertion-weaker-than-name/13-invoice-currency-conversion` · `assertion-weaker-than-name` · p=0.63 · every line is already in EUR, so the conversion the name is about never runs even though the rate table is supplied
- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.19 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `changed-in-lockstep/01-late-fee-grace-period` · `changed-in-lockstep` · p=0.75 · the grace boundary moved by one day and the test's literals were shifted by one day to match it, so the test no longer states the billing rule
- `changed-in-lockstep/02-password-minimum-length` · `changed-in-lockstep` · p=0.77 · the minimum dropped from 12 to 8 and the two fixture passwords were shortened to sit either side of the new number, so the test only ever restates whatever the code does
- `changed-in-lockstep/04-free-tier-seat-limit` · `changed-in-lockstep` · p=0.87 · the free seat cap moved from 5 to 3 and the seat counts in both assertions were moved down with it, so the test tracks the constant rather than a pricing rule
- `changed-in-lockstep/07-delivery-max-attempts` · `changed-in-lockstep` · p=0.81 · the attempt cap went from 3 to 5 and the fixture's attempt count was bumped from 2 to 4 so the same assertion keeps passing
- `changed-in-lockstep/14-invite-default-role` · `changed-in-lockstep` · p=0.83 · the default role for an invite changed from member to admin and the expected object was edited to admin, so a privilege escalation passes under a test whose name still promises the least privileged role
- `happy-path-only-of-risky-boundary/01-transfer-between-accounts` · `happy-path-only-of-risky-boundary` · p=0.50 · transferBatch exists to roll every leg back when one move fails, and neither this test nor any sibling ever makes a leg fail
- `happy-path-only-of-risky-boundary/04-tenant-scoped-document-read` · `happy-path-only-of-risky-boundary` · p=0.55 · read hides documents belonging to another organisation, and every block reads within one organisation — the unknown-id sibling exercises a different branch
- `happy-path-only-of-risky-boundary/10-coupon-redemption` · `happy-path-only-of-risky-boundary` · p=0.43 · the siblings cover expiry and a second customer, but the once-per-customer refusal — the same customer redeeming twice — is never exercised
- `happy-path-only-of-risky-boundary/11-refund-exceeds-capture` · `happy-path-only-of-risky-boundary` · p=0.61 · the sibling covers an unknown charge id, but nothing ever refunds more than was captured, which is the refusal that stops money leaving twice
- `happy-path-only-of-risky-boundary/12-schedule-shift-overlap` · `happy-path-only-of-risky-boundary` · p=0.36 · the siblings cover a backwards shift and two shifts that do not touch, but nothing ever double-books the same staff member, which is the clash the roster exists to refuse
- `happy-path-only-of-risky-boundary/14-queue-visibility-timeout` · `happy-path-only-of-risky-boundary` · p=0.56 · redelivery after the visibility window and the move to the dead-letter list on the fourth receive are the risky paths, and every block here acks or drains on the first receive
- `impossible-fixture/12-payout-account-eligibility` · `impossible-fixture` · p=0.26 · markVerified is the only thing that sets verified, and it turns payouts on at the same time, so a verified account with payouts still disabled is the state that produces the zero under test and nothing else can produce it
- `impossible-fixture/15-document-revision-diff` · `impossible-fixture` · p=0.23 · append always numbers revisions contiguously, so a log that jumps from revision 1 to revision 4 — and therefore has no revision 2 to compare against — is a history the editor cannot write
- `mock-mirrors-implementation/03-fx-conversion` · `mock-mirrors-implementation` · p=0.53 · the fake converter reproduces the real converter's minor-unit scaling and rounding, so the zero-decimal currency handling under test lives entirely in the stub
- `mock-mirrors-implementation/13-price-rules-engine` · `mock-mirrors-implementation` · p=0.53 · the rule data is realistic but the engine beside it duplicates the match predicate, the descending sort and the take-one that make the no-stacking behaviour true
- `mocks-seam-under-test/05-queue-both-sides` · `mocks-seam-under-test` · p=0.78 · the producer's publish is discarded and the consumer reads a hand-written envelope, so the two sides agree because the test wrote both
- `mocks-seam-under-test/07-permission-check-stub` · `mocks-seam-under-test` · p=0.78 · the authorization function whose refusal the test names is itself mocked to reject, so the real role table is never consulted
- `mocks-seam-under-test/11-upload-checksum-among-mocks` · `mocks-seam-under-test` · p=0.82 · the clock, metrics and logger fakes are fair, but the store's checksum is also faked, so the local-versus-remote digest comparison the test names can never disagree
- `mocks-seam-under-test/14-idempotency-key-store` · `mocks-seam-under-test` · p=0.75 · the deduplication depends on the store remembering the first write, and the store is a mock scripted to return the stored response whether or not anything was written
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.81 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `over-mocked/01-invite-route-handler` · `over-mocked` · p=0.78 · auth, validation, persistence and mail are all replaced, so only the handler's four lines of glue are real
- `over-mocked/02-refund-orchestrator` · `over-mocked` · p=0.66 · every collaborator is a stub tuned so the policy limit and the outstanding balance coincide, leaving no real decision to fail
- `over-mocked/03-nightly-rollup-job` · `over-mocked` · p=0.75 · the lock, the warehouse, metrics and slack are all faked and the asserted row count comes straight back out of a stub
- `over-mocked/04-document-export` · `would-pass-if-broken` · p=0.34 · all four collaborators are stubs and the asserted url is the stub's own return, so a wrong storage key passes
- `over-mocked/06-graphql-resolver` · `over-mocked` · p=0.60 · the loader, the permission check and the database are all stubbed to agree, and the assertion echoes the loader's own object
- `over-mocked/07-self-mocked-helpers` · `over-mocked` · p=0.39 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/07-self-mocked-helpers` · `would-pass-if-broken` · p=0.21 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/10-notification-preferences` · `over-mocked` · p=0.46 · the only real code is a constant lookup, since preferences, templates and every transport are stubs that always succeed
- `over-mocked/11-ticket-routing-forwarder` · `would-pass-if-broken` · p=0.18 · station resolution, redirects and printer lookup are all stubs, so the asserted route is what the stubs were told to say
- `over-mocked/12-named-end-to-end` · `over-mocked` · p=0.65 · session, cart, payment call and order creation are all faked, so nothing end to end about the flow actually runs
- `over-mocked/13-sync-service-class` · `over-mocked` · p=0.56 · the sheet reader, the mapper that decides which rows survive and the store are all stubs kept consistent by hand
- `over-mocked/14-dunning-email` · `over-mocked` · p=0.63 · the eligibility decision and the attempt counter are both stubbed, so only string interpolation is left running
- `over-mocked/15-transaction-wrapper` · `over-mocked` · p=0.54 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `over-mocked/15-transaction-wrapper` · `mocks-seam-under-test` · p=0.81 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.11 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/11-billing-anchor-short-month` · `regression-does-not-distinguish` · p=0.63 · the clamp only matters for anchor days past the 28th and every assertion uses day 15, so the pre-fix concatenation produces the same four dates
- `regression-does-not-distinguish/12-replay-window-narrowed` · `regression-does-not-distinguish` · p=0.42 · the tolerance moved from 600 to 300 seconds and the test only uses ages of 60 and 1000 seconds, which fall the same side of both limits
- `regression-does-not-distinguish/13-mention-at-line-start` · `regression-does-not-distinguish` · p=0.72 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.33 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/14-concurrent-stock-reservation` · `regression-does-not-distinguish` · p=0.60 · the two reservations are awaited one after the other so they never interleave, and the pre-fix read-await-write order gives the same three results
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.17 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.13 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.30 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/40-tax-rounding-direction` · `regression-does-not-distinguish` · p=0.66 · the diff swaps floor for round in an existing lineTaxCents, but every rate and subtotal in the test multiplies out to a whole cent, so the pre-change floor returned the same 100, 400 and 6500
- `setup-dominates/04-session-ttl-seconds` · `setup-dominates` · p=0.64 · five module mocks, a tenant, a device and an actor sit in file context for a pure arithmetic assertion that touches none of them
- `setup-dominates/12-permission-denied-reason` · `setup-dominates` · p=0.65 · role definitions, a resource tree, memberships and generated audit entries are never consulted by an assertion that passes two role literals and a boolean
- `swallowed-error-as-success/01-duplicate-signup-try-catch` · `would-pass-if-broken` · p=0.06 · if the duplicate check disappeared the second register would return an account, the catch would never run and the test would still be green
- `swallowed-error-as-success/02-config-parse-fallback` · `swallowed-error-as-success` · p=0.64 · a parseConfig that ignored its input entirely and always returned the defaults would pass this test unchanged
- `swallowed-error-as-success/03-webhook-signature-logged` · `swallowed-error-as-success` · p=0.72 · a crash anywhere in the handler produces the same null and the same logged error, so the test cannot tell a rejected signature from a broken function
- `swallowed-error-as-success/04-bulk-import-not-to-throw` · `swallowed-error-as-success` · p=0.61 · the only assertion is that nothing threw, which importing every row unchecked would also satisfy
- `swallowed-error-as-success/05-payment-error-message-contains` · `vacuous-assertion` · p=0.39 · any error message satisfies the catch and an authorization that wrongly succeeded would skip the catch entirely, leaving nothing asserted
- `swallowed-error-as-success/07-search-fallback-to-cache` · `swallowed-error-as-success` · p=0.74 · a search that never called the backend and always returned the cached array would pass this test unchanged
- `swallowed-error-as-success/08-async-rejection-unawaited` · `vacuous-assertion` · p=0.32 · a dispatcher that accepted the empty payload would skip the catch and still satisfy a count assertion that every integer meets
- `swallowed-error-as-success/09-retry-gives-up` · `swallowed-error-as-success` · p=0.64 · the fallback comes back whether the helper retried three times or gave up immediately, and the attempt count the name promises is never checked
- `swallowed-error-as-success/10-import-error-count` · `swallowed-error-as-success` · p=0.33 · any exception raised while parsing the second row produces one error and one parsed row, so the counts do not distinguish the date rule from an unrelated crash
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.62 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `swallowed-error-as-success/15-empty-list-for-unknown-tenant` · `swallowed-error-as-success` · p=0.58 · the catch logs and returns the same empty array, so a filter that crashed would look exactly like the tenant scoping this test is named for
- `tests-calls-not-outcomes/06-webhook-retry-schedule` · `tests-calls-not-outcomes` · p=0.72 · the backoff delay that the name is about is passed to the mock and never asserted, only that one call happened
- `tests-calls-not-outcomes/13-migration-ordering` · `tests-calls-not-outcomes` · p=0.50 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-calls-not-outcomes/13-migration-ordering` · `would-pass-if-broken` · p=0.11 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-internals/02-private-cache-key` · `tests-internals` · p=0.41 · a private method is called through an any-cast and the string it builds is asserted, not that two tenants get different rows
- `tests-internals/04-handler-source-text` · `would-pass-if-broken` · p=0.23 · it greps the function's source text, so an org-wide lookup that leaked members across tenants would still pass
- `tests-internals/06-import-pipeline-order` · `tests-internals` · p=0.45 · it pins the internal order of three private pipeline steps and never looks at the deduplicated contacts returned
- `tests-internals/06-import-pipeline-order` · `tests-calls-not-outcomes` · p=0.63 · it pins the internal order of three private pipeline steps and never looks at the deduplicated contacts returned
- `tests-internals/07-child-props-spy` · `tests-internals` · p=0.32 · it counts renders of a stubbed child component instead of asserting the tax and total amounts shown to the shopper
- `tests-internals/10-reducer-dispatch-spy` · `tests-internals` · p=0.36 · it asserts the sequence of internal action types while the reducer that enforces the four-seat limit never runs
- `tests-internals/10-reducer-dispatch-spy` · `assertion-weaker-than-name` · p=0.60 · it asserts the sequence of internal action types while the reducer that enforces the four-seat limit never runs
- `tests-internals/11-draft-hook-ref` · `tests-internals` · p=0.45 · the assertion is on a bookkeeping ref rather than the status the UI renders or the draft handed to save
- `tests-internals/12-dedupe-window-size` · `tests-internals` · p=0.43 · it asserts the size of the internal bookkeeping map instead of whether a repeated event id is accepted again
- `tests-internals/12-dedupe-window-size` · `assertion-weaker-than-name` · p=0.67 · it asserts the size of the internal bookkeeping map instead of whether a repeated event id is accepted again
- `tests-internals/13-permission-table-shape` · `would-pass-if-broken` · p=0.14 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `trivial-primitive/09-session-lookup-wrapper` · `trivial-primitive` · p=0.65 · find is a one-line wrapper over Map.get with a null fallback, and every activeUserId test exercises it already
- `trivial-primitive/14-tasks-by-due-date` · `trivial-primitive` · p=0.56 · a one-line sort on an already-sortable ISO date string, and any test of the upcoming column would show tasks coming out in the wrong order
- `vacuous-assertion/12-incident-notification` · `vacuous-assertion` · p=0.37 · toContain passes for a list that also pages the whole directory, which is exactly what the word only rules out
- `would-pass-if-broken/01-invoice-late-fee` · `would-pass-if-broken` · p=0.45 · the fixture is 5 days late so the late-fee branch never runs, and deleting that whole branch leaves the single assertion true
- `would-pass-if-broken/04-retry-backoff` · `would-pass-if-broken` · p=0.49 · only the first delay and the array length are pinned, so a schedule that never doubles and never caps still satisfies both
- `would-pass-if-broken/05-tenant-ticket-listing` · `would-pass-if-broken` · p=0.10 · every seeded ticket belongs to acme, so dropping the tenant filter entirely leaves the asserted id list unchanged
- `would-pass-if-broken/10-rate-limit-window` · `would-pass-if-broken` · p=0.29 · only three calls are made against a limit of five, so a limiter that never resets its window returns true for all three anyway
- `would-pass-if-broken/12-next-business-day` · `would-pass-if-broken` · p=0.16 · 2026-03-03 is a Tuesday so the next day is already a weekday, and removing the weekend skip still yields 2026-03-04
- `would-pass-if-broken/13-document-permissions` · `would-pass-if-broken` · p=0.34 · the admin in the fixture is also the owner, so the owner branch returns true first and deleting the admin rule changes nothing
- `would-pass-if-broken/14-upload-content-type` · `would-pass-if-broken` · p=0.15 · the file is also named .png, so removing the magic-byte scan entirely still resolves image/png through the extension table
- `private/realworld/03-rate-limit-try-catch` · `swallowed-error-as-success` · p=0.12 · nothing forces the catch block to run, so a client that returned normally on a 429 instead of throwing would leave this test green with zero assertions executed
- `private/realworld/04-schedule-manifest-sync` · `assertion-weaker-than-name` · p=0.65 · the name promises the manifest's schedules are the ones synced, but the only check on the sync is that it happened at all, and total is arithmetic on the stub's own return value
- `private/realworld/05-duplicate-workspace-roles` · `over-mocked` · p=0.40 · eight collaborators covering the whole duplication path are stubbed and forty lines of setup lead to one not-called assertion, so nothing about the copied app, the repository fork or the remapped role grants could fail here (setup-dominates unscored: every stub is read by the exercised path; the smell is the over-mocked one)
- `private/realworld/15-merge-commit-protocol` · `tests-calls-not-outcomes` · p=0.29 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `private/realworld/18-alert-route-description` · `would-pass-if-broken` · p=0.48 · the name promises that such a request is routed to this playbook but the routing function is never called, so a matcher that returned the billing playbook for every request would still pass
- `private/realworld/23-invoice-snapshot-freshness` · `setup-dominates` · p=0.63 · thirty lines of fingerprint, currency, plan and savings fixture feed a single not.toThrow, and the only field the gate reads is expiresAt (vacuous-assertion left unscored: a lone not.toThrow on a gate with no sibling driving the throw is labelled both ways in this corpus)
- `private/realworld/31-gateway-webhook-other-events` · `would-pass-if-broken` · p=0.41 · the handler returns undefined on every path, so dropping the event-type guard and settling the seeded invoice would leave this assertion green
- `private/realworld/32-party-summary-partial-row` · `impossible-fixture` · p=0.25 · the cast builds a booking with no id, no createdAt and no attendees array at all, a row the type and the writer never produce, and the branch it reaches depends on that missing array
- `private/realworld/34-status-dictionary-coverage` · `vacuous-assertion` · p=0.45 · swapping every invoice label for a shipment one satisfies known, not-the-raw-key, no-underscore and non-empty, so the loop never pins which label belongs to which status
- `private/realworld/35-slot-capacity-positive` · `would-pass-if-broken` · p=0.32 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `private/realworld/assertions-a-sd/02-cross-org-delete-lookup-miss` · `would-pass-if-broken` · p=0.27 · the fixture makes the lookup return null, so it lands on the not-found branch and never reaches the organization_id ownership check the name describes; deleting that check outright leaves every assertion green
- `private/realworld/assertions-a-sd/05-asset-id-domain-separation` · `would-pass-if-broken` · p=0.29 · the two fixtures are not the same figure identity — one carries a locale, the other a branch and a run nonce — so the hashes differ from the extra material alone and dropping the namespace tag that actually prevents collisions leaves the assertion green
- `private/realworld/assertions-a-sd/07-vendored-copy-null-home` · `would-pass-if-broken` · p=0.11 · deleting the guard that keeps a copy with no claimed home slug still leaves it unfolded, because the key built from a null slug matches no home either, so the length assertion cannot tell the guard from its absence
- `private/realworld/assertions-a/04-unique-ids-after-merge` · `would-pass-if-broken` · p=0.40 · "Sport" and "Sport-" normalize identically, so they are folded into one cluster before ids are assigned and the dedupe suffix path never runs — deleting the used-id bookkeeping entirely still yields three distinct ids
- `private/realworld/assertions-a/06-nullable-not-double-wrapped` · `would-pass-if-broken` · p=0.25 · the one assertion sits behind an Array.isArray guard, and the double-wrap bug the name names produces an anyOf node whose type is undefined — the guard is false, no assertion runs, the test is green
- `private/realworld/assertions-a/09-report-bounds-over-fixture` · `vacuous-assertion` · p=0.55 · past the non-mutation check every assertion is a range any report satisfies — a coverage of 0 with every entry counted as failed passes the same bounds as a fully verified one
- `private/realworld/assertions-a/10-receipt-hidden-while-running` · `would-pass-if-broken` · p=0.10 · the receipt line is gated on cost being present, not on the job running, and the fixture carries no cost at all — remove every running-state check and this assertion still holds
- `private/realworld/assertions-a/11-managed-icon-for-named-glyphs` · `would-pass-if-broken` · p=0.35 · the builder never inspects the icon field at all — every input gets the same fallback entry — so the icon half of the assertion is satisfied by the default and only the start_url half could ever fail
- `private/realworld/assertions-a/12-production-clock` · `vacuous-assertion` · p=0.52 · any Date at or after the line above satisfies both assertions, so a clock returning a timestamp days in the future, or one frozen at the first call, passes unchanged
- `private/realworld/assertions-a/13-floor-points-math` · `assertion-weaker-than-name` · p=0.49 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/13-floor-points-math` · `would-pass-if-broken` · p=0.12 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/14-money-cents-format` · `would-pass-if-broken` · p=0.21 · the exact bug this helper exists to prevent — forgetting the divide by 100 — renders "$2,500.00", which still contains "25" and still matches the currency alternation
- `private/realworld/assertions-a/17-verified-contact-links` · `assertion-weaker-than-name` · p=0.62 · both seeded links are verified, so the filter the name leads with is never exercised — drop the verified predicate entirely and the asserted list is unchanged
- `private/realworld/assertions-a/18-secondary-locale-label` · `would-pass-if-broken` · p=0.15 · the fallback returns the English table name, which is non-empty and is not the code, so a runtime without the secondary-locale data — the case this branch exists for — hands back "Germany" and both assertions still hold
- `private/realworld/assertions-a/19-case-insensitive-search` · `vacuous-assertion` · p=0.52 · comparing two result counts pins nothing about which entries came back, and dropping the lowercasing on both sides makes both queries return zero rows, which is still an equal length
- `private/realworld/assertions-a/19-case-insensitive-search` · `would-pass-if-broken` · p=0.24 · comparing two result counts pins nothing about which entries came back, and dropping the lowercasing on both sides makes both queries return zero rows, which is still an equal length
- `private/realworld/assertions-a/23-venue-timezone-format` · `would-pass-if-broken` · p=0.37 · the timezone the name is about is never observed — drop it and render in UTC and the output still contains the year, which is all the assertion looks at
- `private/realworld/assertions-b-sd/07-ordinary-env-key-allowed` · `vacuous-assertion` · p=0.56 · nothing about the write is checked — an implementation that inserted the wrong key, stored the secret in plaintext, or dropped the deployment targets still resolves to something defined and still calls insert once
- `private/realworld/assertions-b-sd/17-invalid-package-json-rejects` · `swallowed-error-as-success` · p=0.70 · a bare rejects.toThrow() accepts any failure, so a TypeError raised before the parse — or any unrelated throw after the required install — produces the same rejection and the same untouched guide, unlike the sibling that pins /ENOENT/
- `private/realworld/assertions-b-sd/18-scrub-error-false` · `swallowed-error-as-success` · p=0.73 · false is the same value a non-zero exit produces, so nothing in the assertion distinguishes the transport rejection from any other failure, or from a scrub that never ran the command at all
- `private/realworld/assertions-b/01-refund-skip-no-invocation` · `would-pass-if-broken` · p=0.39 · the handover coordinator is never invoked in this block, so the two not.toHaveBeenCalled assertions hold for freshly created spies no matter what the skip path actually does with the drawer or the refund record (tests-calls-not-outcomes left unscored: not opening the drawer is arguably the outcome, and the siblings use the same idiom legitimately)
- `private/realworld/assertions-b/10-occupancy-report-canonical` · `reimplements-logic` · p=0.46 · the expected hour rows are rebuilt in the test by calling the same capacity, interval and bucketing functions the report calls, so a wrong capacity or a shifted hour boundary is computed identically on both sides and the comparison still passes
- `private/realworld/assertions-b/16-archive-fetch-empty-fallback` · `swallowed-error-as-success` · p=0.65 · every failure inside the archive walk is caught and turned into the same empty array, so a domain lookup that returned nothing, a cassette miss, or a crash in the parser all satisfy this assertion just as a network error does
- `private/realworld/assertions-c/02-reasoning-parts-multiturn` · `would-pass-if-broken` · p=0.48 · the only unconditional assertions are messages.length > 0 and an assistant message existing; every check on reasoning metadata sits inside `if (reasoningParts.length > 0)` and `if ('providerMetadata' in part)` and is toBeDefined, so a provider that emitted no reasoning parts or dropped the details entirely stays green
- `private/realworld/assertions-c/06-schema-export-defined` · `would-pass-if-broken` · p=0.27 · `expect(VehicleSchema).toBeDefined()` holds for any non-undefined export, so a schema with every field removed or the wrong shape entirely passes; the import itself already guarantees what the assertion checks
- `private/realworld/assertions-c/07-parallel-tool-calls-stream` · `would-pass-if-broken` · p=0.44 · the name promises parallel tool calls but verifyParallelToolCalls only requires >= 1 tool-call part and verifyResponseContent accepts any text containing 'time' or 'weather', so a provider that surfaced only the first of two tool_calls (or an assistant that called one tool per turn) passes every assertion
- `private/realworld/assertions-c/10-reasoning-effort-low` · `vacuous-assertion` · p=0.51 · the three sibling effort levels assert the identical thing (truthy text, positive token counts, expect.any(Number) usage), none of which depends on `reasoning.effort` reaching the request body; a doGenerate that dropped providerOptions.gateway on the floor passes all of them
- `private/realworld/assertions-d/03-authority-error-category-enum` · `would-pass-if-broken` · p=0.38 · the name promises a stable enum but the constructor is a plain field assignment that accepts any string, which the block itself asserts with not.toThrow(); adding a fourth category or removing the type entirely leaves every assertion green, and no failure path is exercised at all
- `private/realworld/assertions-d/11-package-response-sort-order` · `vacuous-assertion` · p=0.48 · the only assertion beyond the 200 is toHaveProperty("sortOrder") in a loop over the response, which passes when the route emits sortOrder: undefined for every package, swaps every value, or returns an empty list; no value is pinned against the seeded sort_order
- `private/realworld/diff-d/09-settle-conflict-no-resubmit-key` · `changed-in-lockstep` · p=0.81 · the old assertion stated the requirement negatively, no retry or resubmit key on any resolution, plus four toContain lines; the rewrite replaces all of it with the exact three-key list the reworked function now returns, so the next change to the result shape is met by editing the list rather than by a requirement the test states on its own. The fixture payloads also swapped from the deleted branches to the surviving one
- `private/realworld/diff-e/01-indirect-expansion-still-flagged` · `regression-does-not-distinguish` · p=0.60 · the fix only rewrote the zsh =(...) lookbehind so that JS arrow functions inside node -e strings stop matching; this block feeds `echo ${!prefix}`, which the untouched indirectExpansion regex already matched before the change, so the assertion is true on both sides and never reaches the edited regex
- `private/realworld/diff-e/02-dangerous-expansion-asks-user` · `regression-does-not-distinguish` · p=0.68 · the only implementation change is the zsh =(...) regex gaining a token-boundary lookbehind; `echo "${var@P}"` trips the untouched dangerousParameterExpansion regex on both sides, so getCommandDecision answered ask_user before the fix exactly as it does after, and the bug (arrow functions in node -e flagged as process substitution) is never exercised
- `private/realworld/diff-e/07-relay-default-max-tokens` · `regression-does-not-distinguish` · p=0.55 · the fix made defaultTemperature a required parameter (dropping the implicit `= 0`) so providers with a non-zero default stop being silently overridden; this pre-existing block now passes defaultTemperature: 0, the very value the removed default supplied, and asserts only maxTokens, so it passes identically before and after; the edit adds a required argument, it does not move an expected value
- `private/realworld/diff-e/09-api-key-loading-unchanged` · `regression-does-not-distinguish` · p=0.60 · the fix makes the models hook return the configured catalog when the CLI is unavailable and drops the warning log; this pre-existing block passes available = true (the value the removed default supplied) and an api-key auth, which returned provider.models on the first line before the new guard on both sides, so every assertion holds pre-fix; the edit only spells out arguments the old defaults already gave
- `private/realworld/diff-e/10-authorize-stores-resource-name` · `regression-does-not-distinguish` · p=0.54 · the change touches only the models hook (an availability guard and a removed warning log) and makes three optional constructor arguments required; this block exercises the oauth authorize callback, which is byte-identical on both sides, with the same values the old defaults supplied, so the pre-fix code produces the same success object and scope list; the expected values did not move with the code
- `private/realworld/diff-e/11-resume-keeps-summary-filtered` · `regression-does-not-distinguish` · p=0.47 · the fix lives in the resume path (task-resume.ts), which now keeps a trailing summary message intact instead of lifting it out as ordinary user content; this block never calls that code, it hand-builds the post-resume history the fix is supposed to produce and feeds it to getEffectiveApiHistory, which is untouched by the diff, so both assertions hold on the pre-fix code and the bug (the summary being stripped on resume) is never exercised
- `private/realworld/diff-e/14-omitted-messages-preserved` · `regression-does-not-distinguish` · p=0.62 · the fix adds a guard that keeps the previous chatMessages when an incoming push carries a seq that is not newer; this block's push omits chatMessages entirely, so the plain `{ ...prevRest, ...newRest }` spread already preserved both the messages and the seq before the guard existed and the added condition (which requires newState.chatMessages !== undefined) is never true; it passes at runtime on the pre-fix code, the only parent-side complaint would be a type error on the new chatMessagesSeq field
- `private/realworld/diff-e/16-linked-post-headline-unchanged` · `regression-does-not-distinguish` · p=0.31 · the only code change is a description string in manifest.ts; forumEntryToHeadline is byte-identical on both sides and never filtered on pinned or stickied posts, so this entry, whose [link] anchor points at an outside publisher, already parsed to a headline before the change and the not-null assertion holds on the pre-fix tree
- `private/realworld/diff-e/50-here-string-substitution-guard` · `regression-does-not-distinguish` · p=0.73 · the fix only rewrote the zsh =(...) lookbehind so that `=>` inside a node -e string no longer matches; this block feeds `cat <<<$(whoami)`, which the untouched here-string regex `/<<<\s*(\$\(|`)/` already returned true for, so the assertion holds on the pre-fix code
- `private/realworld/diff-e/54-default-temperature-zero` · `regression-does-not-distinguish` · p=0.65 · the bug was providers with a non-zero default (0.3) silently getting the implicit `defaultTemperature = 0`; the fix removes that default. This block passes `defaultTemperature: 0`, exactly the old implicit value, and asserts 0, so the pre-fix code returns the same 0. The name and call shape changed but `toBe(0)` was not rewritten to a new output
- `private/realworld/diff-e/57-custom-arn-images-flag` · `regression-does-not-distinguish` · p=0.63 · the diff flips the custom-arn literal `supportsPromptCache: false` to `true`; this block reaches that branch but asserts `supportsImages`, which was already `true` in the old literal, so it passes on the pre-fix code. The sibling asserting supportsPromptCache is the one that pins the change. The router-model hooks are first-party collaborators mocked away
- `private/realworld/diff-e/60-selected-cli-resource-authorize` · `regression-does-not-distinguish` · p=0.66 · the fix is inside the `models` hook (skip discovery when the CLI is unavailable, stop logging on failure) and makes the trailing parameters required; this block only calls the oauth method's authorize/callback, which the diff does not touch, so the old defaults yield the same `accountId: "selected-resource"`. The call gained an explicit `true` but the expectation is unchanged
- `private/realworld/diff-e/61-distinct-ids-same-display-name` · `regression-does-not-distinguish` · p=0.61 · the fix merges rows with the same (model, multiplier) key; this block feeds two rows with different model ids, which the old code never merged either, so both sides sort by quotaCost to ["second", "first"]. It guards against over-merging but the input never reaches the new grouping branch; the same-model siblings are what fail before the fix
- `private/realworld/diff-e/63-chat-completions-payload-still-read` · `regression-does-not-distinguish` · p=0.37 · the change adds a Responses-API branch keyed on `Array.isArray(payload.output)` and optional `sources`; this block feeds a plain chat-completions payload with `choices`, which skips the new branch and takes the unchanged path returning exactly `{ rawObject, usage }` on both sides. It is a keep-working guard; only the `output` payload sibling reaches the new code
- `private/realworld/mocks-c/18-cache-key-format` · `would-pass-if-broken` · p=0.18 · nothing is faked and nothing from the implementation runs: six literal strings are matched against a regex written in the test, so no asserted value came out of a stub, and any change to how the pipeline actually builds its keys leaves every assertion green
- `private/realworld/mocks-c/19-usage-forwarded` · `happy-path-only-of-risky-boundary` · p=0.52 · the model gateway is the one fake and it is a true external edge; the real generate path re-validates the value against the schema before it forwards usage, and the second assertion reads buildSourcePrefix output that no stub touched
- `private/realworld/mocks-c/24-unfilled-row-shimmer` · `would-pass-if-broken` · p=0.17 · the expected marker is a literal class name, nothing recomputes the unfilled-and-running rule; but with only trims.enumerated landed the still-pending Overview, Specs and History sections render the same pulse class, so a row that never shimmered would leave toContain('animate-pulse') green
- `private/realworld/mocks-d/06-readiness-ready-passthrough` · `mocks-seam-under-test` · p=0.71 · the equivalence the name claims (ready ≡ adminDataReady) is decided by the channel consumer behind deps.getReadiness, which is the stub here; every asserted value is the stub's own field returned unchanged, and the client's guards only throw and alter nothing asserted, so a client that forwarded ready untouched passes on this both-true fixture (over-mocked not_fire: a single fake at the edge with the real validator running is not glue; mirrors not_fire: the stub is fixed data, not a copy of the client)
- `private/realworld/mocks-d/07-readiness-unready-passthrough` · `mocks-seam-under-test` · p=0.64 · all four asserted values (ready, adminDataReady, consumerHealthy, admin.catalogVersion) are exactly what the getReadiness stub returned; the real client only validates and spreads them, so a client that forwarded or inverted nothing on this both-false fixture is indistinguishable from one that maps unreadiness deliberately (over-mocked not_fire: one fake at the edge and the real validator runs; mirrors not_fire: the stub is a fixed payload)
- `private/realworld/mocks-d/07-readiness-unready-passthrough` · `would-pass-if-broken` · p=0.30 · all four asserted values (ready, adminDataReady, consumerHealthy, admin.catalogVersion) are exactly what the getReadiness stub returned; the real client only validates and spreads them, so a client that forwarded or inverted nothing on this both-false fixture is indistinguishable from one that maps unreadiness deliberately (over-mocked not_fire: one fake at the edge and the real validator runs; mirrors not_fire: the stub is a fixed payload)
- `private/realworld/mocks-sd/07-cron-guard-branch` · `mocks-seam-under-test` · p=0.83 · whether a request counts as an authenticated cron worker is decided entirely by the stubbed guard, so a guard that compares the wrong header or accepts a missing secret still produces a green test, and the only unmocked code left is the if-branch and a passthrough of the stub's own count
- `private/realworld/mocks-sd/13-row-policy-upsert-spy` · `over-mocked` · p=0.49 · the policy write the name promises is only evidenced by a spy on the stubbed persistence call and the admin requirement only by the literal string handed to the stubbed guard, so a guard that ignores its level argument or a write that never commits still passes; every collaborator including the column-type lookup is scripted
- `private/realworld/mocks-sd/16-destinations-passthrough` · `over-mocked` · p=0.72 · the guard and the notification module are both first-party stubs, so the only real code left is a try/catch and handing the stub's own object back as JSON — the asserted body is literally the value the mock was configured to return and nothing about how destinations are assembled can fail
- `private/realworld/mocks-sd/19-readonly-role-mint` · `over-mocked` · p=0.70 · every collaborator the handler calls — access check, connection and branch reads, role provisioning, the mapping writes and even the advisory-lock wrapper — is a stub, so the assertions only check that one stub's return value was passed to the next; no real role is minted and no two components could disagree about what a SELECT-only credential is
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `mocks-seam-under-test` · p=0.53 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `over-mocked` · p=0.31 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/04-whole-amounts-enforced-by-fake` · `mock-mirrors-implementation` · p=0.52 · the test-only client throws on any non-integer amount, so it is the fake, not the production adapter's rounding, that guarantees the asserted invariant
- `private/realworld/mocks/05-coupon-authority-call-args` · `tests-calls-not-outcomes` · p=0.28 · the coupon authority is a vi.fn and the only evidence is the arguments it received, so a resolver that applied the wrong scope, cap or discount amount would leave this test green (mocks-seam-under-test unscored: the smell here is the co-labelled check's shape, not a scripted seam)
- `private/realworld/mocks/06-order-submit-passthrough` · `over-mocked` · p=0.68 · the ordering service that mints the display number and validates the lines is a vi.fn, so what remains real is forwarding the request and prefixing the returned number with a hash
- `private/realworld/mocks/07-account-panel-slot-stub` · `over-mocked` · p=0.74 · both the heading strings and the contributed panel come from the mocked module, so the registry could resolve no contributor at all and the page would still render the stub's markup; the stub is a plain echo rather than a copy of the resolver
- `private/realworld/mocks/08-recovery-dialog-network-stub` · `mocks-seam-under-test` · p=0.78 · every recovery endpoint is fulfilled by page.route, so the recommendation, the settled status and the emptied list are all strings the test wrote; resolveCharge could settle a charge the provider never succeeded and this journey would still pass
- `private/realworld/mocks/11-aggregate-totals-reduce` · `reimplements-logic` · p=0.47 · every expected total is the same summation the function performs, run again in the test, so a bucket added twice or omitted from the aggregate would produce identical numbers on both sides
- `private/realworld/mocks/14-hour-price-label-composed` · `reimplements-logic` · p=0.47 · the label under assertion is assembled in the test with the same template the component uses, so PassPrice could append the unit to every pass, or drop it entirely, without failing anything here
- `private/realworld/mocks/15-agreement-tamper-mock-throws` · `mocks-seam-under-test` · p=0.55 · the tampered content hash is never compared against a published template because acceptAgreementRequest is a vi.fn told to reject, so removing the hash check entirely would not fail this test
- `private/realworld/scope-a-sd/09-policy-sample-fields` · `tests-internals` · p=0.46 · this block never calls either strip function: it only checks that the table's field names appear on fixtures written in the same file, so a policy that names a field the real tool payload never carries still passes as long as the local sample carries it
- `private/realworld/scope-a/03-phone-field-height-class` · `tests-internals` · p=0.41 · it asserts a utility class string is present in the rendered tags, so the two halves can still render at different heights whenever a later class or an inline style wins, and any rename of the height token breaks the test without any visual change
- `private/realworld/scope-b-sd/20-price-id-membership` · `trivial-primitive` · p=0.63 · isLocalPriceId is a one-line Set.has over the collection its sibling already tests, so the membership assertion adds nothing a checkout test touching a configured price would not show
- `private/realworld/scope-b/04-default-tab-membership` · `trivial-primitive` · p=0.63 · the block asserts that a constant declared from the same literal union is in that union, which the type system already guarantees and which no runtime change could break without the sibling fallback tests failing first
- `private/realworld/scope-b/20-congruence-always-ok` · `happy-path-only-of-risky-boundary` · p=0.37 · checkEndpointCongruence exists to return ok:false with missingHandlers, missingClaims, invalidPaths or duplicate normalized pairs, and all three blocks only ever assert ok:true, so a version that returned ok unconditionally — losing every incongruence report — would pass every one of them
- `private/realworld/scope-c/07-is-record-garbage` · `trivial-primitive` · p=0.65 · isCar is a one-line wrapper (`CarSchema.safeParse(input).success`); the sibling validateCar test and every consumer of CarSchema exercise the same parse, so a break here shows up anywhere the schema is used
- `private/realworld/scope-c/16-lone-trim-delta` · `setup-dominates` · p=0.39 · the block's own construction is a full eight-field engine override (code, displacement, aspiration, cylinders, rotors, power, torque, redline) on a single trim, but a single-member cluster hits `cluster.length < 2 → continue` before compareCapability or diffTrims ever read an engine field, so none of those eight values can affect the asserted null deltaFrom
- `private/realworld/scope-c/40-spec-source-uses-shared-builder` · `tests-internals` · p=0.13 · the asserted value is the source text of other test files read off disk with readFileSync, sliced by function name and searched for a call expression; that is peeking at source rather than at any behaviour, and renaming the builder or inlining it breaks the assertion while a fixture that paints-and-exits through a differently named helper does not
- `private/realworld/scope-d/02-stale-quote-error` · `trivial-primitive` · p=0.61 · isStaleCheckoutQuoteError is a message-equality wrapper around one exported constant; the block asserts the constant matches itself and another string does not, which any checkout test that surfaces the refresh action would exercise
- `private/realworld/scope-d/04-authority-error-category` · `trivial-primitive` · p=0.61 · The block constructs CatalogAuthorityError three times and reads back the constructor's public readonly field plus instanceof Error; the sibling and every route test that maps a category to a 503 already depends on that field
- `private/realworld/scope-d/10-route-authority-evidence` · `tests-internals` · p=0.26 · missingEvidence is computed entirely from route source text read by discoverApiMethods and matched for identifiers and substrings by routeCarriesDeclaredAuthority; no route runs, so a route that calls getSession and then ignores its result passes

## False positives (labelled not_fire, p at or above the check's own threshold)

- `dogfood/19-falls-back-to-the-project-claude-skill` · `reimplements-logic` · p=0.79 · the test asserts WHERE the fallback wrote (project path, not home); comparing the file to skillMarkdown() is a parity check against the generator, not an expected value recomputed with production logic
- `private/realworld/12-gate-bypass-header` · `mocks-seam-under-test` · p=0.85 · the header that actually leaves on the request is read off the real request init, and the scope string handed to the signer is the wire contract a widened bypass would break
- `private/realworld/assertions-a-sd/17-streak-cleared-on-enforce` · `assertion-weaker-than-name` · p=0.84 · clearing the streak is a call into another module, so the call with the enforced org's id is the observable behaviour the name names, and it fails if the clear is skipped or passed the wrong org
- `private/realworld/assertions-a/02-citation-strip-empty` · `would-pass-if-broken` · p=0.55 · the name promises exactly what the assertion pins — empty in, empty out — so a stripper that threw, returned undefined or emitted whitespace for the empty case fails it
- `private/realworld/assertions-c/12-valid-json-response` · `assertion-weaker-than-name` · p=0.84 · the name promises the response parses as valid JSON; doGenerate throws ApiCallError/TypeValidationError on a body that fails JSON.parse or the schema, so reaching the assertions is the whole contract (throw-or-not) and a non-empty text plus finishReason is what a successfully parsed completion looks like
- `private/realworld/assertions-c/16-online-streaming-no-errors` · `vacuous-assertion` · p=0.58 · the name promises only that streaming completes without errors; doStream validates every SSE chunk against StreamChunkSchema and throws TypeValidationError on a chunk whose id is not a string, so the failure this guards is a throw before the assertions, and a non-empty accumulated text is exactly what an error-free stream produces
- `private/realworld/assertions-c/16-online-streaming-no-errors` · `assertion-weaker-than-name` · p=0.70 · the name promises only that streaming completes without errors; doStream validates every SSE chunk against StreamChunkSchema and throws TypeValidationError on a chunk whose id is not a string, so the failure this guards is a throw before the assertions, and a non-empty accumulated text is exactly what an error-free stream produces
- `private/realworld/assertions-c/20-event-seq-uniqueness` · `swallowed-error-as-success` · p=0.79 · the rejection is forced by `rejects.toThrow()` and the first appendEvent with seq 1 must resolve before it, while the sibling 'appendEvent allocates monotonic seqs' pins appendEvent returning 1 then 2, so an implementation that threw on every insert could not stay green; the bare toThrow is loose but the failure path is provably reached and distinguished
- `private/realworld/assertions-d/01-list-contract-rejects-snake-case` · `swallowed-error-as-success` · p=0.81 · the bare toThrow() sits on a strict zod parse whose whole contract is reject-or-accept, and the siblings pin the same parser accepting the camelCase fixture, so a parser that always threw could not stay green
- `private/realworld/diff-d/10-discount-draft-round-up-default` · `changed-in-lockstep` · p=0.91 · the three literals that already existed, amount, '30' and Comp, are untouched; the diff adds a roundUp flag to the draft shape and the test adds the one value the requirement allows for an intent that carries no roundUp, false. Nothing was read off the implementation, the shape gained a field with its documented default
- `private/realworld/mocks-d/01-unpause-needs-confirm` · `mocks-seam-under-test` · p=0.85 · the two-step gate (Unpause reveals Confirm Unpause; only the second tap calls onUnlock) is the rendered component's own state machine, and onUnlock is a callback prop at the parent boundary, not a faked collaborator; the sibling first-tap test pins the other half of the gate
- `private/realworld/mocks-d/01-unpause-needs-confirm` · `over-mocked` · p=0.80 · the two-step gate (Unpause reveals Confirm Unpause; only the second tap calls onUnlock) is the rendered component's own state machine, and onUnlock is a callback prop at the parent boundary, not a faked collaborator; the sibling first-tap test pins the other half of the gate
- `private/realworld/mocks-sd/09-forwards-transition-target` · `mocks-seam-under-test` · p=0.88 · the named behaviour is that the handler forwards every admin target rather than filtering any of them out, and that is decided by the handler's own schema and call site — a schema narrowed to a subset makes the 400 branch fire and the assertion fail, while the legality decision the stub stands in for is deliberately not what is asserted
- `private/realworld/scope-b-sd/17-merge-request-key-prefix` · `trivial-primitive` · p=0.84 · the literal is a persisted encoding: the round-trip sibling stays green for any prefix because both halves change together, so only this assertion catches a rename that orphans every merge-request row already in the database
- `private/realworld/scope-b/05-greeting-hour-buckets` · `trivial-primitive` · p=0.78 · the three blocks pin both bucket boundaries (11 vs 12, 17 vs 18) of a time-of-day split whose only caller reads the wall clock, so an off-by-one there would render a plausible-looking greeting that no wider test could observe
- `private/realworld/scope-b/08-sse-frame-format` · `trivial-primitive` · p=0.78 · this pins a wire-format encoding whose separators are load-bearing — drop the blank line after data and every frame stops being dispatched to clients, a break the sibling replay tests read straight out of the log and never see
- `private/realworld/scope-c/18-file-annotation-content-array` · `setup-dominates` · p=0.75 · the block builds one ~45-line response literal and hands the whole of it to a zod parse, which reads every field: usage's three token counts, the assistant role literal, the annotation's type/hash/name/content are all required by the schema, and the passthrough extras (native_finish_reason, refusal) are the very thing the name says the parse must tolerate
- `private/realworld/scope-c/25-replay-probe-records-reply` · `happy-path-only-of-risky-boundary` · p=0.71 · the probe's refusals are the six-clause guard that declines to record and the pass-through of a rejected original; the it.each sibling drives each declining clause by name and the 'preserves a failed reattach' sibling drives the rejection, so this allowed-path block leaves no refusal uncovered

## Iterations

Prompt-rewrite history from `evals/iterations.json`.

### `happy-path-only-of-risky-boundary`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.60 | 0.40 | no |
| enumerate-branches-procedure | 0.88 | 0.86 | no |
| risk-ranked-branches | 0.88 | 0.67 | no |
| procedure+self-refusal-negative | 0.92 | 0.86 | no |
| +allowed-side-of-same-rule | 0.92 | 1.00 | no |
| baseline (round 3) | 0.61 | 0.67 | yes |
| risky-list + success-only gate | 0.44 | 0.67 | no |
| no-risky-surface gate + allowed-side | 0.56 | 0.86 | no |
| +sibling-name-describes-consequence | 0.61 | 0.40 | no |
| +precondition-is-not-a-refusal | 0.44 | 0.40 | no |
| inverted: is the riskiest refusal exercised here, by a sibling, or is there none? (round 3) | 0.20 | 0.00 | yes |
| v1 + it.each template / refusing-consequence sibling names count (round 3) | 0.20 | 0.00 | no |

### `mocks-seam-under-test`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.23 | 0.40 | no |
| ownership-of-named-behaviour | 0.80 | 0.67 | no |
| ownership + canned-read/called-only arms | 0.84 | 1.00 | no |
| + hands-back-the-compared-value arm | 0.89 | 1.00 | no |
| + called-with-right-arguments (rejected) | 0.80 | 0.67 | no |
| baseline | 0.00 | 0.00 | no |
| follow-the-asserted-value | 0.25 | 0.00 | no |
| no-clauses-first | 0.31 | 0.50 | no |
| yes-procedure + rule-out list | 0.56 | 0.67 | yes |
| + end-to-end-real-db rule-out | 0.53 | 0.80 | no |
| deciding-statement procedure (round 3, harvested corpus, train-only fit) | 0.79 | 0.00 | no |
| baseline + spy-only-write yes arm + stateful-fake rule-out (round 3) | 0.83 | 0.67 | no |
| v2 + route-stub/module-mock-is-the-seam clause (round 3) | 0.87 | 0.29 | yes |
| inverted: does the real deciding code run here? score = 1 − answer (round 3, 4th) | 0.31 | 0.50 | no |
| v3 wording, polarity flipped only (round 3, 5th, over cap at the user's request) | 0.86 | 0.73 | yes |
| inverted + break simulation: stub the deciding statement, does an assertion fail? (round 3, 6th) | 0.00 | 0.00 | no |
| real-code-produced-the-value rule first, then the mock arms (round 4, 7th) | 0.18 | 0.00 | no |

### `over-mocked`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.59 | 0.67 | no |
| collaborators-of-impl + first-party-vs-external-edge | 0.96 | 0.86 | no |
| baseline (realworld corpus) | 0.10 | 0.00 | no |
| provenance-of-asserted-value | 0.88 | 0.80 | yes |
| v2 no-fake-precondition + spy-args | 0.85 | 0.50 | no |
| list first-party collaborators; yes when the deciding ones are all fakes and only glue runs (round 3) | 0.92 | 0.71 | yes |
| v1 minus try/catch-as-glue, plus error-from-a-fake handled by real code is a decision (round 3) | 0.94 | 0.77 | yes |
| + all-fakes-and-only-a-call-assertion / mocked-module-supplied-text arms (round 4) | 0.52 | 0.67 | no |

### `swallowed-error-as-success`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.15 | 0.00 | no |
| decision-procedure-4-steps | 0.86 | 0.67 | no |
| v2-constant-fallback-and-rigged-mock | 0.91 | 0.86 | no |
| v3-names-the-failure-negatives | 0.96 | 0.86 | no |
| v4-first-match-wins | 0.96 | 0.75 | no |
| baseline (realworld corpus) | 0.00 | 0.00 | no |
| v1-no-list-before-gates | 0.00 | 0.00 | no |
| v2-restore-no-failure-path-gate | 0.10 | 0.75 | no |
| v3-sibling-contrast-promoted | 0.10 | 0.75 | no |
| v4-error-status-is-not-a-swallow | 0.41 | 0.89 | yes |
| inverted: does the test pin the specific failure? score = 1 − answer (round 4) | 0.10 | 0.33 | no |

### `setup-dominates`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.38 | 0.40 | no |
| inventory-vs-read | 1.00 | 1.00 | no |
| inventory-vs-read + discriminator clause | 1.00 | 1.00 | no |
| baseline | 0.56 | 0.40 | no |
| charge-own-setup-only | 0.92 | 1.00 | no |
| charge-then-size-escape | 0.92 | 1.00 | yes |

### `tests-internals`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.56 | 1.00 | no |
| contract-surface-vs-peeking | 1.00 | 1.00 | no |
| baseline | 0.29 | 0.00 | no |
| asserted-value-no-list-first | 0.94 | 1.00 | no |
| +never-runs-consumer qualifier | 0.88 | 1.00 | no |
| v1 + dispatch-sequence-to-unrun-reducer | 0.94 | 1.00 | yes |
| a returned string is a return value even when it is source/script/HTML/SQL; 'own source text' means the unit's file (round 3) | 0.97 | 0.86 | yes |

### `would-pass-if-broken`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.77 | 0.62 | no |
| branch-only procedure | 0.65 | 0.62 | no |
| break-and-rerun procedure | 0.86 | 0.76 | no |
| break-and-rerun + exact-output-is-no | 0.81 | 0.86 | no |
| break-and-rerun + exact-output criteria | 0.88 | 0.78 | no |
| baseline-r3 | 0.00 | 0.00 | no |
| two-run negation, pinned-output no | 0.27 | 0.33 | no |
| two-run + named escapes | 0.34 | 0.42 | no |
| break-and-rerun + named escapes + exact-output-is-no | 0.64 | 0.57 | yes |
| + fallback/comparison-moves-together escape | 0.59 | 0.50 | no |
| simulate the break: write the broken version, run the fixture through it, compare (round 3) | 0.82 | 0.70 | no |
| v1 + no-assertion / if-guarded / off-promise assertions are yes outright (round 3) | 0.81 | 0.67 | yes |
| inverted: 'would an obvious break make an assertion fail?', score = 1 − answer (round 3) | 0.84 | 0.65 | yes |

### `reimplements-logic`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.75 | 1.00 | no |
| stored-artifact-first (expected-side framing) | 0.57 | 0.67 | no |
| drift-guard exemption + input-or-expectation recomputation | 0.97 | 1.00 | yes |
| expected-side only; inputs built by production code, parity, property and drift guards are no (round 3) | 0.65 | 0.46 | no |
| v1 + manufactured-from-the-rule input is yes + committed artifact vs generator is always no (round 3) | 0.65 | 0.57 | yes |
| v2 + expected string/key/row set assembled from the same template or helper composition is yes (round 3) | 0.83 | 0.75 | yes |

### `trivial-primitive`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.89 | 0.89 | yes |
| body-shape decision procedure | 0.90 | 0.89 | no |
| +constant table, +inputs-built-by-real-code | 0.89 | 0.89 | no |
| +enum-constant carve-out, +validates | 0.80 | 0.57 | no |
| v1 + constant-switch sentence | 0.86 | 0.89 | no |

### `vacuous-assertion`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.18 | 0.20 | no |
| wrong-result procedure + look-alike no-list | 0.83 | 0.72 | yes |
| v1 + lone-not.toThrow / table-loop / distinguishing-substring clauses | 0.51 | 0.61 | no |
| v1 + sharpened table-loop clause | 0.81 | 0.61 | no |
| + table-loop, if-guarded, undefined-on-every-path, later-clock yes arms; validate-and-throw call success is no (round 3) | 0.52 | 0.29 | yes |
| validate-and-throw success as the first decision (round 3) | 0.89 | 0.67 | no |
| v2 + the success rule applies only when the name promises no more than success (round 3) | 0.85 | 0.80 | yes |

### `impossible-fixture`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.00 | 0.00 | no |
| name-the-violated-rule + writer-would-also-store negative | 0.59 | 0.86 | no |
| would-accept phrasing + guard-input carve-out | 0.00 | 0.00 | no |
| v1 + seed/hydrate bypass is how it gets in | 0.86 | 1.00 | yes |
| v3 + cast-reads-the-omitted-field yes | 0.86 | 1.00 | no |
| first decide where the fixture goes: refused by the rule under test → no; past the rule → yes (round 3) | 0.87 | 0.50 | yes |
| v1 + seeded/literal row the writer would refuse counts as past the rule (round 3) | 0.92 | 0.50 | yes |
| v2 + declared legacy/corrupt rows are the subject → no (round 3) | 0.96 | 0.50 | yes |

### `broad-snapshot`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.15 | 0.00 | no |
| two-gates-recorded-artifact-then-breadth | 0.96 | 1.00 | yes |

### `tests-calls-not-outcomes`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.81 | 0.67 | no |
| no-list-first + unpinned-derivation | 0.94 | 0.86 | no |
| no-list-first + concrete-result rescue | 0.94 | 1.00 | yes |

### `regression-does-not-distinguish`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline (round 4) | 0.69 | 0.44 | no |
| new-code gate (all-additions → no) + two look-alikes | 0.82 | 0.67 | no |
| new-code gate + name-the-changed-input search | 0.92 | 0.86 | yes |
| + 'outcome reached through an older rule' look-alike | 0.92 | 0.50 | no |
| simulate both sides on the fixture; rename/reformat/dropped-unsupplied-field diffs have no fix to lock (round 5, real cases) | 0.57 | 0.60 | yes |
| v1 + removed-default-now-passed-explicitly and assertions-unchanged shapes named as yes (round 5) | 0.67 | 0.67 | yes |

### `changed-in-lockstep`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline (round 4) | 0.91 | 1.00 | no |
| new-code gate (all-additions test file) + pair-expectation-to-impl-line (full-run numbers) | 0.96 | 1.00 | yes |

## Cost

280780 input tokens ≈ $0.0118 for the full corpus (949 cases, ~296 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
