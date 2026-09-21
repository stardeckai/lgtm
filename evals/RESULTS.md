# lgtm eval results

956 labelled cases (521 public + 435 private, synthetic + anonymized real-world) · 1717 scored (check, case) pairs · model `jev-1.13.0`

Split: 693 train · 263 holdout (223 real).

Corpus: 521 public + 435 private labelled cases (456 real), 263 held out (223 real). Each check's threshold is fitted on the train cases to the lowest point that fires on no real negative and keeps precision at or above 0.95, plus one step of margin; recall is what that leaves. Ground truth lives only in `expect.json`, never in the files the model sees. The 435 real cases were harvested by scoring every test block in real codebases, sampling around each threshold, and reading each block against its implementation; they are anonymized and kept private because anonymization removes names, not shape.

## Held out, per check

High-confidence findings sit at or above the check's high-confidence line; all flagged includes the worth-a-look band from the threshold up.

| check | threshold | high-confidence precision/recall | all flagged precision/recall | held-out +/− |
|---|---|---|---|---|
| `would-pass-if-broken` | 0.50 | 1.00/0.12 | 0.90/0.35 | 26/16 |
| `vacuous-assertion` | 0.58 | 1.00/0.37 | 1.00/0.89 | 19/24 |
| `assertion-weaker-than-name` | 0.68 | 0.93/0.87 | 0.93/0.87 | 15/8 |
| `reimplements-logic` | 0.60 | 1.00/0.67 | 1.00/0.83 | 6/22 |
| `mocks-seam-under-test` | 0.84 | —/0.00 | 0.83/0.63 | 8/20 |
| `mock-mirrors-implementation` | 0.60 | 1.00/1.00 | 1.00/1.00 | 1/7 |
| `tests-calls-not-outcomes` | 0.75 | —/0.00 | 1.00/0.50 | 4/19 |
| `tests-internals` | 0.55 | 1.00/0.50 | 1.00/0.50 | 6/14 |
| `setup-dominates` | 0.70 | 1.00/0.67 | 0.75/1.00 | 3/18 |
| `broad-snapshot` | 0.35 | —/— | —/— | 0/7 |
| `swallowed-error-as-success` | 0.75 | —/0.00 | 0.33/0.20 | 5/19 |
| `impossible-fixture` | 0.50 | 0.50/0.33 | 0.33/0.33 | 3/20 |
| `happy-path-only-of-risky-boundary` | 0.65 | 1.00/0.40 | 0.80/0.80 | 5/16 |
| `trivial-primitive` | 0.68 | 0.80/0.62 | 0.85/0.85 | 13/15 |
| `over-mocked` | 0.80 | —/0.00 | 0.67/0.29 | 7/30 |
| `regression-does-not-distinguish` | 0.75 | —/0.00 | 1.00/0.57 | 14/5 |
| `changed-in-lockstep` | 0.90 | 1.00/1.00 | 0.50/1.00 | 1/8 |
| **all** | | 0.92/0.33 | 0.87/0.63 | 136/268 |

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 76 | 45 | 0.50 | 1.00/0.60/0.75 | 0.90/0.35/0.50 | 0.97/0.51/0.67 | 0.93 @ 0.14 |
| `vacuous-assertion` | 51 | 146 | 0.58 | 0.96/0.75/0.84 | 1.00/0.89/0.94 | 0.94/0.90/0.92 | 0.94 @ 0.37 |
| `assertion-weaker-than-name` | 71 | 27 | 0.68 | 0.96/0.89/0.93 | 0.93/0.87/0.90 | 0.87/0.96/0.91 | 0.95 @ 0.60 |
| `reimplements-logic` | 32 | 183 | 0.60 | 0.96/0.92/0.94 | 1.00/0.83/0.91 | 0.91/0.91/0.91 | 0.95 @ 0.47 |
| `mocks-seam-under-test` | 28 | 105 | 0.84 | 0.87/0.65/0.74 | 0.83/0.63/0.71 | 0.50/1.00/0.67 | 0.84 @ 0.71 |
| `mock-mirrors-implementation` | 19 | 28 | 0.60 | 1.00/0.83/0.91 | 1.00/1.00/1.00 | 0.90/1.00/0.95 | 0.97 @ 0.52 |
| `tests-calls-not-outcomes` | 23 | 55 | 0.75 | 1.00/0.84/0.91 | 1.00/0.50/0.67 | 0.88/0.91/0.89 | 0.97 @ 0.50 |
| `tests-internals` | 29 | 45 | 0.55 | 1.00/0.70/0.82 | 1.00/0.50/0.67 | 1.00/0.66/0.79 | 0.98 @ 0.32 |
| `setup-dominates` | 17 | 53 | 0.70 | 1.00/0.71/0.83 | 0.75/1.00/0.86 | 0.70/0.94/0.80 | 0.96 @ 0.63 |
| `broad-snapshot` | 16 | 35 | 0.35 | 1.00/0.94/0.97 | —/—/— | 1.00/0.81/0.90 | 1.00 @ 0.19 |
| `swallowed-error-as-success` | 24 | 59 | 0.75 | 1.00/0.53/0.69 | 0.33/0.20/0.25 | 0.76/0.92/0.83 | 0.90 @ 0.57 |
| `impossible-fixture` | 18 | 65 | 0.50 | 1.00/0.80/0.89 | 0.33/0.33/0.33 | 0.87/0.72/0.79 | 0.93 @ 0.44 |
| `happy-path-only-of-risky-boundary` | 23 | 73 | 0.65 | 1.00/0.61/0.76 | 0.80/0.80/0.80 | 0.74/0.87/0.80 | 0.88 @ 0.52 |
| `trivial-primitive` | 41 | 97 | 0.68 | 0.96/0.82/0.88 | 0.85/0.85/0.85 | 0.75/1.00/0.85 | 0.96 @ 0.61 |
| `over-mocked` | 24 | 80 | 0.80 | 1.00/0.24/0.38 | 0.67/0.29/0.40 | 0.75/0.88/0.81 | 0.83 @ 0.50 |
| `regression-does-not-distinguish` | 44 | 34 | 0.75 | 1.00/0.50/0.67 | 1.00/0.57/0.73 | 0.95/0.86/0.90 | 0.92 @ 0.36 |
| `changed-in-lockstep` | 17 | 34 | 0.90 | 1.00/0.63/0.77 | 0.50/1.00/0.67 | 0.68/1.00/0.81 | 0.94 @ 0.75 |

Holdout is the test set: every 2nd real case and every 10th synthetic one (263, 223 real). Thresholds are fitted on train only and prompts are never tuned against holdout, so its numbers are the ones to trust; with a handful of held-out positives per check they are still coarse.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 796/956 (0.83) · holdout: 216/263 (0.82).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 536 | 69 | 40 |
| **mocked_seam_unit** | 1 | 155 | 8 |
| **contract_integration** | 24 | 18 | 105 |

## Misses (labelled fire, p below the check's own threshold)

Private cases are numbered as in `evals/atlas.html` and carry no label reason here; the reasons live with the cases in the private corpus.

- `assertion-weaker-than-name/13-invoice-currency-conversion` · `assertion-weaker-than-name` · p=0.63 · every line is already in EUR, so the conversion the name is about never runs even though the rate table is supplied
- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.19 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `changed-in-lockstep/01-late-fee-grace-period` · `changed-in-lockstep` · p=0.75 · the grace boundary moved by one day and the test's literals were shifted by one day to match it, so the test no longer states the billing rule
- `changed-in-lockstep/02-password-minimum-length` · `changed-in-lockstep` · p=0.81 · the minimum dropped from 12 to 8 and the two fixture passwords were shortened to sit either side of the new number, so the test only ever restates whatever the code does
- `changed-in-lockstep/04-free-tier-seat-limit` · `changed-in-lockstep` · p=0.89 · the free seat cap moved from 5 to 3 and the seat counts in both assertions were moved down with it, so the test tracks the constant rather than a pricing rule
- `changed-in-lockstep/07-delivery-max-attempts` · `changed-in-lockstep` · p=0.81 · the attempt cap went from 3 to 5 and the fixture's attempt count was bumped from 2 to 4 so the same assertion keeps passing
- `changed-in-lockstep/14-invite-default-role` · `changed-in-lockstep` · p=0.84 · the default role for an invite changed from member to admin and the expected object was edited to admin, so a privilege escalation passes under a test whose name still promises the least privileged role
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
- `mocks-seam-under-test/05-queue-both-sides` · `mocks-seam-under-test` · p=0.80 · the producer's publish is discarded and the consumer reads a hand-written envelope, so the two sides agree because the test wrote both
- `mocks-seam-under-test/07-permission-check-stub` · `mocks-seam-under-test` · p=0.74 · the authorization function whose refusal the test names is itself mocked to reject, so the real role table is never consulted
- `mocks-seam-under-test/11-upload-checksum-among-mocks` · `mocks-seam-under-test` · p=0.83 · the clock, metrics and logger fakes are fair, but the store's checksum is also faked, so the local-versus-remote digest comparison the test names can never disagree
- `mocks-seam-under-test/14-idempotency-key-store` · `mocks-seam-under-test` · p=0.75 · the deduplication depends on the store remembering the first write, and the store is a mock scripted to return the stored response whether or not anything was written
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.81 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `over-mocked/01-invite-route-handler` · `over-mocked` · p=0.75 · auth, validation, persistence and mail are all replaced, so only the handler's four lines of glue are real
- `over-mocked/02-refund-orchestrator` · `over-mocked` · p=0.63 · every collaborator is a stub tuned so the policy limit and the outstanding balance coincide, leaving no real decision to fail
- `over-mocked/03-nightly-rollup-job` · `over-mocked` · p=0.77 · the lock, the warehouse, metrics and slack are all faked and the asserted row count comes straight back out of a stub
- `over-mocked/04-document-export` · `would-pass-if-broken` · p=0.34 · all four collaborators are stubs and the asserted url is the stub's own return, so a wrong storage key passes
- `over-mocked/05-dashboard-page` · `over-mocked` · p=0.78 · every hook is stubbed and the formatter returns a fixed string, so neither the open-order filter nor the total is exercised
- `over-mocked/06-graphql-resolver` · `over-mocked` · p=0.67 · the loader, the permission check and the database are all stubbed to agree, and the assertion echoes the loader's own object
- `over-mocked/07-self-mocked-helpers` · `over-mocked` · p=0.42 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/07-self-mocked-helpers` · `would-pass-if-broken` · p=0.21 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/10-notification-preferences` · `over-mocked` · p=0.50 · the only real code is a constant lookup, since preferences, templates and every transport are stubs that always succeed
- `over-mocked/11-ticket-routing-forwarder` · `would-pass-if-broken` · p=0.18 · station resolution, redirects and printer lookup are all stubs, so the asserted route is what the stubs were told to say
- `over-mocked/12-named-end-to-end` · `over-mocked` · p=0.68 · session, cart, payment call and order creation are all faked, so nothing end to end about the flow actually runs
- `over-mocked/13-sync-service-class` · `over-mocked` · p=0.56 · the sheet reader, the mapper that decides which rows survive and the store are all stubs kept consistent by hand
- `over-mocked/14-dunning-email` · `over-mocked` · p=0.61 · the eligibility decision and the attempt counter are both stubbed, so only string interpolation is left running
- `over-mocked/15-transaction-wrapper` · `over-mocked` · p=0.53 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.11 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/11-billing-anchor-short-month` · `regression-does-not-distinguish` · p=0.73 · the clamp only matters for anchor days past the 28th and every assertion uses day 15, so the pre-fix concatenation produces the same four dates
- `regression-does-not-distinguish/12-replay-window-narrowed` · `regression-does-not-distinguish` · p=0.39 · the tolerance moved from 600 to 300 seconds and the test only uses ages of 60 and 1000 seconds, which fall the same side of both limits
- `regression-does-not-distinguish/13-mention-at-line-start` · `regression-does-not-distinguish` · p=0.67 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.34 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/14-concurrent-stock-reservation` · `regression-does-not-distinguish` · p=0.58 · the two reservations are awaited one after the other so they never interleave, and the pre-fix read-await-write order gives the same three results
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.10 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.11 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.42 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/40-tax-rounding-direction` · `regression-does-not-distinguish` · p=0.71 · the diff swaps floor for round in an existing lineTaxCents, but every rate and subtotal in the test multiplies out to a whole cent, so the pre-change floor returned the same 100, 400 and 6500
- `setup-dominates/04-session-ttl-seconds` · `setup-dominates` · p=0.64 · five module mocks, a tenant, a device and an actor sit in file context for a pure arithmetic assertion that touches none of them
- `setup-dominates/12-permission-denied-reason` · `setup-dominates` · p=0.65 · role definitions, a resource tree, memberships and generated audit entries are never consulted by an assertion that passes two role literals and a boolean
- `swallowed-error-as-success/01-duplicate-signup-try-catch` · `would-pass-if-broken` · p=0.06 · if the duplicate check disappeared the second register would return an account, the catch would never run and the test would still be green
- `swallowed-error-as-success/02-config-parse-fallback` · `swallowed-error-as-success` · p=0.65 · a parseConfig that ignored its input entirely and always returned the defaults would pass this test unchanged
- `swallowed-error-as-success/03-webhook-signature-logged` · `swallowed-error-as-success` · p=0.64 · a crash anywhere in the handler produces the same null and the same logged error, so the test cannot tell a rejected signature from a broken function
- `swallowed-error-as-success/04-bulk-import-not-to-throw` · `swallowed-error-as-success` · p=0.57 · the only assertion is that nothing threw, which importing every row unchecked would also satisfy
- `swallowed-error-as-success/05-payment-error-message-contains` · `vacuous-assertion` · p=0.39 · any error message satisfies the catch and an authorization that wrongly succeeded would skip the catch entirely, leaving nothing asserted
- `swallowed-error-as-success/06-result-ok-false-only` · `swallowed-error-as-success` · p=0.72 · an unknown account, a thrown exception and an overdraft all produce the identical ok false, and no balance is read back to show nothing moved
- `swallowed-error-as-success/07-search-fallback-to-cache` · `swallowed-error-as-success` · p=0.73 · a search that never called the backend and always returned the cached array would pass this test unchanged
- `swallowed-error-as-success/08-async-rejection-unawaited` · `vacuous-assertion` · p=0.32 · a dispatcher that accepted the empty payload would skip the catch and still satisfy a count assertion that every integer meets
- `swallowed-error-as-success/09-retry-gives-up` · `swallowed-error-as-success` · p=0.63 · the fallback comes back whether the helper retried three times or gave up immediately, and the attempt count the name promises is never checked
- `swallowed-error-as-success/10-import-error-count` · `swallowed-error-as-success` · p=0.30 · any exception raised while parsing the second row produces one error and one parsed row, so the counts do not distinguish the date rule from an unrelated crash
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.62 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `swallowed-error-as-success/15-empty-list-for-unknown-tenant` · `swallowed-error-as-success` · p=0.59 · the catch logs and returns the same empty array, so a filter that crashed would look exactly like the tenant scoping this test is named for
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
- `private/003` · `swallowed-error-as-success` · p=0.14
- `private/004` · `assertion-weaker-than-name` · p=0.65
- `private/005` · `over-mocked` · p=0.39
- `private/015` · `tests-calls-not-outcomes` · p=0.29
- `private/018` · `would-pass-if-broken` · p=0.48
- `private/023` · `setup-dominates` · p=0.63
- `private/031` · `would-pass-if-broken` · p=0.41
- `private/032` · `impossible-fixture` · p=0.25
- `private/034` · `vacuous-assertion` · p=0.45
- `private/035` · `would-pass-if-broken` · p=0.32
- `private/042` · `would-pass-if-broken` · p=0.27
- `private/045` · `would-pass-if-broken` · p=0.29
- `private/047` · `would-pass-if-broken` · p=0.11
- `private/066` · `would-pass-if-broken` · p=0.40
- `private/068` · `would-pass-if-broken` · p=0.25
- `private/071` · `vacuous-assertion` · p=0.55
- `private/072` · `would-pass-if-broken` · p=0.10
- `private/073` · `would-pass-if-broken` · p=0.35
- `private/074` · `vacuous-assertion` · p=0.52
- `private/075` · `assertion-weaker-than-name` · p=0.49
- `private/075` · `would-pass-if-broken` · p=0.12
- `private/076` · `would-pass-if-broken` · p=0.21
- `private/079` · `assertion-weaker-than-name` · p=0.62
- `private/080` · `would-pass-if-broken` · p=0.15
- `private/081` · `vacuous-assertion` · p=0.52
- `private/081` · `would-pass-if-broken` · p=0.24
- `private/085` · `would-pass-if-broken` · p=0.37
- `private/095` · `vacuous-assertion` · p=0.56
- `private/105` · `swallowed-error-as-success` · p=0.68
- `private/106` · `swallowed-error-as-success` · p=0.71
- `private/109` · `would-pass-if-broken` · p=0.39
- `private/118` · `reimplements-logic` · p=0.46
- `private/124` · `swallowed-error-as-success` · p=0.59
- `private/137` · `would-pass-if-broken` · p=0.48
- `private/141` · `would-pass-if-broken` · p=0.27
- `private/142` · `would-pass-if-broken` · p=0.44
- `private/145` · `vacuous-assertion` · p=0.51
- `private/160` · `would-pass-if-broken` · p=0.38
- `private/167` · `vacuous-assertion` · p=0.48
- `private/180` · `changed-in-lockstep` · p=0.80
- `private/182` · `regression-does-not-distinguish` · p=0.66
- `private/183` · `regression-does-not-distinguish` · p=0.72
- `private/188` · `regression-does-not-distinguish` · p=0.55
- `private/190` · `regression-does-not-distinguish` · p=0.58
- `private/191` · `regression-does-not-distinguish` · p=0.53
- `private/192` · `regression-does-not-distinguish` · p=0.51
- `private/195` · `regression-does-not-distinguish` · p=0.65
- `private/197` · `regression-does-not-distinguish` · p=0.36
- `private/203` · `regression-does-not-distinguish` · p=0.61
- `private/205` · `regression-does-not-distinguish` · p=0.58
- `private/208` · `regression-does-not-distinguish` · p=0.66
- `private/209` · `regression-does-not-distinguish` · p=0.61
- `private/211` · `regression-does-not-distinguish` · p=0.37
- `private/227` · `would-pass-if-broken` · p=0.18
- `private/228` · `happy-path-only-of-risky-boundary` · p=0.52
- `private/233` · `would-pass-if-broken` · p=0.17
- `private/240` · `mocks-seam-under-test` · p=0.71
- `private/241` · `mocks-seam-under-test` · p=0.66
- `private/241` · `would-pass-if-broken` · p=0.30
- `private/258` · `over-mocked` · p=0.50
- `private/261` · `over-mocked` · p=0.73
- `private/264` · `over-mocked` · p=0.70
- `private/269` · `mocks-seam-under-test` · p=0.56
- `private/269` · `over-mocked` · p=0.33
- `private/270` · `mock-mirrors-implementation` · p=0.52
- `private/271` · `tests-calls-not-outcomes` · p=0.28
- `private/272` · `over-mocked` · p=0.68
- `private/273` · `over-mocked` · p=0.70
- `private/274` · `mocks-seam-under-test` · p=0.77
- `private/277` · `reimplements-logic` · p=0.47
- `private/279` · `reimplements-logic` · p=0.47
- `private/280` · `mocks-seam-under-test` · p=0.56
- `private/302` · `tests-internals` · p=0.46
- `private/311` · `tests-internals` · p=0.41
- `private/350` · `trivial-primitive` · p=0.63
- `private/354` · `trivial-primitive` · p=0.63
- `private/370` · `happy-path-only-of-risky-boundary` · p=0.37
- `private/380` · `trivial-primitive` · p=0.65
- `private/386` · `setup-dominates` · p=0.39
- `private/410` · `tests-internals` · p=0.13
- `private/414` · `trivial-primitive` · p=0.61
- `private/416` · `trivial-primitive` · p=0.61
- `private/422` · `tests-internals` · p=0.26
- `private/429` · `impossible-fixture` · p=0.44
- `private/430` · `impossible-fixture` · p=0.45

## False positives (labelled not_fire, p at or above the check's own threshold)

- `dogfood/19-falls-back-to-the-project-claude-skill` · `reimplements-logic` · p=0.79
- `private/012` · `mocks-seam-under-test` · p=0.87
- `private/057` · `assertion-weaker-than-name` · p=0.84
- `private/064` · `would-pass-if-broken` · p=0.55
- `private/147` · `assertion-weaker-than-name` · p=0.84
- `private/151` · `vacuous-assertion` · p=0.58
- `private/151` · `assertion-weaker-than-name` · p=0.70
- `private/155` · `swallowed-error-as-success` · p=0.78
- `private/159` · `swallowed-error-as-success` · p=0.81
- `private/181` · `changed-in-lockstep` · p=0.92
- `private/235` · `mocks-seam-under-test` · p=0.85
- `private/235` · `over-mocked` · p=0.80
- `private/254` · `mocks-seam-under-test` · p=0.89
- `private/347` · `trivial-primitive` · p=0.84
- `private/355` · `trivial-primitive` · p=0.78
- `private/358` · `trivial-primitive` · p=0.78
- `private/388` · `setup-dominates` · p=0.75
- `private/395` · `happy-path-only-of-risky-boundary` · p=0.71
- `private/431` · `impossible-fixture` · p=0.61
- `private/434` · `impossible-fixture` · p=0.70

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

869707 input tokens ≈ $0.0365 for the full corpus (956 cases, ~910 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
