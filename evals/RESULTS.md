# lgtm eval results

868 labelled cases (521 public + 347 private, synthetic + anonymized real-world) · 1602 scored (check, case) pairs · model `jev-1.13.0`

Split: 623 train · 245 holdout (187 real).

Corpus: 521 public + 347 private labelled cases (368 real), 245 held out (187 real). Each check's threshold is fitted on the train cases to the lowest point that fires on no real negative and keeps precision at or above 0.95, plus one step of margin; recall is what that leaves. Ground truth lives only in `expect.json`, never in the files the model sees. The 347 real cases were harvested by scoring every test block in real codebases, sampling around each threshold, and reading each block against its implementation; they are anonymized and kept private because anonymization removes names, not shape.

## Held out, per check

High-confidence findings sit at or above the check's high-confidence line; all flagged includes the worth-a-look band from the threshold up.

| check | threshold | high-confidence precision/recall | all flagged precision/recall | held-out +/− |
|---|---|---|---|---|
| `would-pass-if-broken` | 0.35 | 0.91/0.42 | 0.81/0.54 | 24/18 |
| `vacuous-assertion` | 0.58 | 1.00/0.33 | 1.00/0.83 | 18/28 |
| `assertion-weaker-than-name` | 0.68 | 1.00/0.58 | 1.00/0.84 | 19/6 |
| `reimplements-logic` | 0.60 | 1.00/0.90 | 1.00/0.90 | 10/26 |
| `mocks-seam-under-test` | 0.84 | 1.00/0.17 | 1.00/0.67 | 6/18 |
| `mock-mirrors-implementation` | 0.55 | 1.00/0.50 | 1.00/0.75 | 4/10 |
| `tests-calls-not-outcomes` | 0.75 | —/0.00 | 1.00/0.67 | 6/16 |
| `tests-internals` | 0.35 | 1.00/0.57 | 0.86/0.86 | 7/11 |
| `setup-dominates` | 0.70 | 1.00/0.67 | 0.67/0.67 | 3/17 |
| `broad-snapshot` | 0.35 | 1.00/0.67 | 1.00/1.00 | 3/14 |
| `swallowed-error-as-success` | 0.70 | 1.00/0.43 | 0.71/0.71 | 7/14 |
| `impossible-fixture` | 0.50 | 1.00/0.33 | 1.00/0.33 | 3/18 |
| `happy-path-only-of-risky-boundary` | 0.65 | —/0.00 | 1.00/0.60 | 5/17 |
| `trivial-primitive` | 0.68 | 1.00/0.57 | 1.00/0.86 | 14/12 |
| `over-mocked` | 0.55 | 0.80/0.57 | 0.83/0.71 | 7/19 |
| `regression-does-not-distinguish` | 0.35 | 1.00/0.50 | 1.00/0.50 | 2/1 |
| `changed-in-lockstep` | 0.80 | 1.00/0.50 | 1.00/1.00 | 2/2 |
| **all** | | 0.97/0.46 | 0.93/0.74 | 140/247 |

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 71 | 44 | 0.35 | 1.00/0.72/0.84 | 0.81/0.54/0.65 | 0.97/0.54/0.69 | 0.94 @ 0.11 |
| `vacuous-assertion` | 49 | 145 | 0.58 | 1.00/0.84/0.91 | 1.00/0.83/0.91 | 0.91/0.88/0.90 | 0.97 @ 0.42 |
| `assertion-weaker-than-name` | 68 | 27 | 0.68 | 0.94/0.92/0.93 | 1.00/0.84/0.91 | 0.88/0.97/0.92 | 0.94 @ 0.66 |
| `reimplements-logic` | 31 | 182 | 0.60 | 0.95/0.90/0.93 | 1.00/0.90/0.95 | 0.97/0.90/0.93 | 0.95 @ 0.42 |
| `mocks-seam-under-test` | 26 | 102 | 0.84 | 0.87/0.65/0.74 | 1.00/0.67/0.80 | 0.52/1.00/0.68 | 0.91 @ 0.74 |
| `mock-mirrors-implementation` | 18 | 24 | 0.55 | 1.00/0.93/0.96 | 1.00/0.75/0.86 | 1.00/1.00/1.00 | 1.00 @ 0.52 |
| `tests-calls-not-outcomes` | 23 | 54 | 0.75 | 1.00/0.82/0.90 | 1.00/0.67/0.80 | 0.84/0.91/0.87 | 0.97 @ 0.58 |
| `tests-internals` | 25 | 45 | 0.35 | 1.00/0.94/0.97 | 0.86/0.86/0.86 | 1.00/0.64/0.78 | 1.00 @ 0.30 |
| `setup-dominates` | 17 | 51 | 0.70 | 1.00/0.79/0.88 | 0.67/0.67/0.67 | 0.76/0.94/0.84 | 0.96 @ 0.64 |
| `broad-snapshot` | 16 | 35 | 0.35 | 1.00/0.92/0.96 | 1.00/1.00/1.00 | 1.00/0.81/0.90 | 1.00 @ 0.21 |
| `swallowed-error-as-success` | 24 | 53 | 0.70 | 1.00/0.53/0.69 | 0.71/0.71/0.71 | 0.85/0.92/0.88 | 0.94 @ 0.55 |
| `impossible-fixture` | 16 | 60 | 0.50 | 1.00/0.85/0.92 | 1.00/0.33/0.50 | 1.00/0.75/0.86 | 0.96 @ 0.49 |
| `happy-path-only-of-risky-boundary` | 23 | 73 | 0.65 | 0.92/0.67/0.77 | 1.00/0.60/0.75 | 0.80/0.87/0.83 | 0.91 @ 0.59 |
| `trivial-primitive` | 39 | 90 | 0.68 | 0.88/0.88/0.88 | 1.00/0.86/0.92 | 0.83/1.00/0.91 | 0.93 @ 0.58 |
| `over-mocked` | 24 | 70 | 0.55 | 1.00/0.76/0.87 | 0.83/0.71/0.77 | 0.95/0.79/0.86 | 0.94 @ 0.48 |
| `regression-does-not-distinguish` | 17 | 24 | 0.35 | 1.00/0.87/0.93 | 1.00/0.50/0.67 | 1.00/0.76/0.87 | 0.93 @ 0.45 |
| `changed-in-lockstep` | 16 | 20 | 0.80 | 1.00/0.86/0.92 | 1.00/1.00/1.00 | 0.89/1.00/0.94 | 1.00 @ 0.75 |

Holdout is the test set: every 2nd real case and every 10th synthetic one (245, 187 real). Thresholds are fitted on train only and prompts are never tuned against holdout, so its numbers are the ones to trust; with a handful of held-out positives per check they are still coarse.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 730/868 (0.84) · holdout: 206/245 (0.84).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 490 | 60 | 31 |
| **mocked_seam_unit** | 2 | 141 | 5 |
| **contract_integration** | 24 | 16 | 99 |

## Misses (labelled fire, p below the check's own threshold)

- `assertion-weaker-than-name/13-invoice-currency-conversion` · `assertion-weaker-than-name` · p=0.59 · every line is already in EUR, so the conversion the name is about never runs even though the rate table is supplied
- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.21 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `changed-in-lockstep/01-late-fee-grace-period` · `changed-in-lockstep` · p=0.75 · the grace boundary moved by one day and the test's literals were shifted by one day to match it, so the test no longer states the billing rule
- `changed-in-lockstep/02-password-minimum-length` · `changed-in-lockstep` · p=0.78 · the minimum dropped from 12 to 8 and the two fixture passwords were shortened to sit either side of the new number, so the test only ever restates whatever the code does
- `happy-path-only-of-risky-boundary/01-transfer-between-accounts` · `happy-path-only-of-risky-boundary` · p=0.62 · transferBatch exists to roll every leg back when one move fails, and neither this test nor any sibling ever makes a leg fail
- `happy-path-only-of-risky-boundary/04-tenant-scoped-document-read` · `happy-path-only-of-risky-boundary` · p=0.59 · read hides documents belonging to another organisation, and every block reads within one organisation — the unknown-id sibling exercises a different branch
- `happy-path-only-of-risky-boundary/10-coupon-redemption` · `happy-path-only-of-risky-boundary` · p=0.40 · the siblings cover expiry and a second customer, but the once-per-customer refusal — the same customer redeeming twice — is never exercised
- `happy-path-only-of-risky-boundary/11-refund-exceeds-capture` · `happy-path-only-of-risky-boundary` · p=0.64 · the sibling covers an unknown charge id, but nothing ever refunds more than was captured, which is the refusal that stops money leaving twice
- `happy-path-only-of-risky-boundary/12-schedule-shift-overlap` · `happy-path-only-of-risky-boundary` · p=0.40 · the siblings cover a backwards shift and two shifts that do not touch, but nothing ever double-books the same staff member, which is the clash the roster exists to refuse
- `happy-path-only-of-risky-boundary/14-queue-visibility-timeout` · `happy-path-only-of-risky-boundary` · p=0.60 · redelivery after the visibility window and the move to the dead-letter list on the fourth receive are the risky paths, and every block here acks or drains on the first receive
- `impossible-fixture/12-payout-account-eligibility` · `impossible-fixture` · p=0.32 · markVerified is the only thing that sets verified, and it turns payouts on at the same time, so a verified account with payouts still disabled is the state that produces the zero under test and nothing else can produce it
- `impossible-fixture/13-webhook-delivery-backoff` · `impossible-fixture` · p=0.49 · attempts starts at zero in enqueueDelivery and only ever increases, so a delivery with -1 attempts and a recorded 502 is a row the delivery pipeline cannot write, and the 500ms answer never occurs in production
- `impossible-fixture/15-document-revision-diff` · `impossible-fixture` · p=0.26 · append always numbers revisions contiguously, so a log that jumps from revision 1 to revision 4 — and therefore has no revision 2 to compare against — is a history the editor cannot write
- `mock-mirrors-implementation/13-price-rules-engine` · `mock-mirrors-implementation` · p=0.52 · the rule data is realistic but the engine beside it duplicates the match predicate, the descending sort and the take-one that make the no-stacking behaviour true
- `mocks-seam-under-test/05-queue-both-sides` · `mocks-seam-under-test` · p=0.81 · the producer's publish is discarded and the consumer reads a hand-written envelope, so the two sides agree because the test wrote both
- `mocks-seam-under-test/07-permission-check-stub` · `mocks-seam-under-test` · p=0.75 · the authorization function whose refusal the test names is itself mocked to reject, so the real role table is never consulted
- `mocks-seam-under-test/11-upload-checksum-among-mocks` · `mocks-seam-under-test` · p=0.79 · the clock, metrics and logger fakes are fair, but the store's checksum is also faked, so the local-versus-remote digest comparison the test names can never disagree
- `mocks-seam-under-test/14-idempotency-key-store` · `mocks-seam-under-test` · p=0.74 · the deduplication depends on the store remembering the first write, and the store is a mock scripted to return the stored response whether or not anything was written
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.80 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `over-mocked/07-self-mocked-helpers` · `over-mocked` · p=0.39 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/07-self-mocked-helpers` · `would-pass-if-broken` · p=0.21 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/10-notification-preferences` · `over-mocked` · p=0.48 · the only real code is a constant lookup, since preferences, templates and every transport are stubs that always succeed
- `over-mocked/11-ticket-routing-forwarder` · `would-pass-if-broken` · p=0.19 · station resolution, redirects and printer lookup are all stubs, so the asserted route is what the stubs were told to say
- `over-mocked/15-transaction-wrapper` · `over-mocked` · p=0.53 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `over-mocked/15-transaction-wrapper` · `mocks-seam-under-test` · p=0.82 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.16 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.28 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.22 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.23 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.34 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `setup-dominates/04-session-ttl-seconds` · `setup-dominates` · p=0.54 · five module mocks, a tenant, a device and an actor sit in file context for a pure arithmetic assertion that touches none of them
- `setup-dominates/12-permission-denied-reason` · `setup-dominates` · p=0.64 · role definitions, a resource tree, memberships and generated audit entries are never consulted by an assertion that passes two role literals and a boolean
- `swallowed-error-as-success/01-duplicate-signup-try-catch` · `would-pass-if-broken` · p=0.05 · if the duplicate check disappeared the second register would return an account, the catch would never run and the test would still be green
- `swallowed-error-as-success/02-config-parse-fallback` · `swallowed-error-as-success` · p=0.68 · a parseConfig that ignored its input entirely and always returned the defaults would pass this test unchanged
- `swallowed-error-as-success/03-webhook-signature-logged` · `swallowed-error-as-success` · p=0.68 · a crash anywhere in the handler produces the same null and the same logged error, so the test cannot tell a rejected signature from a broken function
- `swallowed-error-as-success/04-bulk-import-not-to-throw` · `swallowed-error-as-success` · p=0.55 · the only assertion is that nothing threw, which importing every row unchecked would also satisfy
- `swallowed-error-as-success/05-payment-error-message-contains` · `vacuous-assertion` · p=0.42 · any error message satisfies the catch and an authorization that wrongly succeeded would skip the catch entirely, leaving nothing asserted
- `swallowed-error-as-success/08-async-rejection-unawaited` · `vacuous-assertion` · p=0.30 · a dispatcher that accepted the empty payload would skip the catch and still satisfy a count assertion that every integer meets
- `swallowed-error-as-success/09-retry-gives-up` · `swallowed-error-as-success` · p=0.63 · the fallback comes back whether the helper retried three times or gave up immediately, and the attempt count the name promises is never checked
- `swallowed-error-as-success/10-import-error-count` · `swallowed-error-as-success` · p=0.34 · any exception raised while parsing the second row produces one error and one parsed row, so the counts do not distinguish the date rule from an unrelated crash
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.64 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `swallowed-error-as-success/15-empty-list-for-unknown-tenant` · `swallowed-error-as-success` · p=0.60 · the catch logs and returns the same empty array, so a filter that crashed would look exactly like the tenant scoping this test is named for
- `tests-calls-not-outcomes/06-webhook-retry-schedule` · `tests-calls-not-outcomes` · p=0.73 · the backoff delay that the name is about is passed to the mock and never asserted, only that one call happened
- `tests-calls-not-outcomes/13-migration-ordering` · `tests-calls-not-outcomes` · p=0.58 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-calls-not-outcomes/13-migration-ordering` · `would-pass-if-broken` · p=0.11 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-internals/04-handler-source-text` · `would-pass-if-broken` · p=0.24 · it greps the function's source text, so an org-wide lookup that leaked members across tenants would still pass
- `tests-internals/06-import-pipeline-order` · `tests-calls-not-outcomes` · p=0.67 · it pins the internal order of three private pipeline steps and never looks at the deduplicated contacts returned
- `tests-internals/07-child-props-spy` · `tests-internals` · p=0.30 · it counts renders of a stubbed child component instead of asserting the tax and total amounts shown to the shopper
- `tests-internals/10-reducer-dispatch-spy` · `assertion-weaker-than-name` · p=0.61 · it asserts the sequence of internal action types while the reducer that enforces the four-seat limit never runs
- `tests-internals/12-dedupe-window-size` · `assertion-weaker-than-name` · p=0.66 · it asserts the size of the internal bookkeeping map instead of whether a repeated event id is accepted again
- `tests-internals/13-permission-table-shape` · `would-pass-if-broken` · p=0.13 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `trivial-primitive/09-session-lookup-wrapper` · `trivial-primitive` · p=0.65 · find is a one-line wrapper over Map.get with a null fallback, and every activeUserId test exercises it already
- `trivial-primitive/14-tasks-by-due-date` · `trivial-primitive` · p=0.58 · a one-line sort on an already-sortable ISO date string, and any test of the upcoming column would show tasks coming out in the wrong order
- `vacuous-assertion/12-incident-notification` · `vacuous-assertion` · p=0.44 · toContain passes for a list that also pages the whole directory, which is exactly what the word only rules out
- `would-pass-if-broken/05-tenant-ticket-listing` · `would-pass-if-broken` · p=0.11 · every seeded ticket belongs to acme, so dropping the tenant filter entirely leaves the asserted id list unchanged
- `would-pass-if-broken/10-rate-limit-window` · `would-pass-if-broken` · p=0.30 · only three calls are made against a limit of five, so a limiter that never resets its window returns true for all three anyway
- `would-pass-if-broken/12-next-business-day` · `would-pass-if-broken` · p=0.16 · 2026-03-03 is a Tuesday so the next day is already a weekday, and removing the weekend skip still yields 2026-03-04
- `would-pass-if-broken/13-document-permissions` · `would-pass-if-broken` · p=0.31 · the admin in the fixture is also the owner, so the owner branch returns true first and deleting the admin rule changes nothing
- `would-pass-if-broken/14-upload-content-type` · `would-pass-if-broken` · p=0.18 · the file is also named .png, so removing the magic-byte scan entirely still resolves image/png through the extension table
- `private/realworld/03-rate-limit-try-catch` · `swallowed-error-as-success` · p=0.13 · nothing forces the catch block to run, so a client that returned normally on a 429 instead of throwing would leave this test green with zero assertions executed
- `private/realworld/04-schedule-manifest-sync` · `assertion-weaker-than-name` · p=0.62 · the name promises the manifest's schedules are the ones synced, but the only check on the sync is that it happened at all, and total is arithmetic on the stub's own return value
- `private/realworld/05-duplicate-workspace-roles` · `over-mocked` · p=0.38 · eight collaborators covering the whole duplication path are stubbed and forty lines of setup lead to one not-called assertion, so nothing about the copied app, the repository fork or the remapped role grants could fail here (setup-dominates unscored: every stub is read by the exercised path; the smell is the over-mocked one)
- `private/realworld/15-merge-commit-protocol` · `tests-calls-not-outcomes` · p=0.27 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `private/realworld/23-invoice-snapshot-freshness` · `setup-dominates` · p=0.64 · thirty lines of fingerprint, currency, plan and savings fixture feed a single not.toThrow, and the only field the gate reads is expiresAt (vacuous-assertion left unscored: a lone not.toThrow on a gate with no sibling driving the throw is labelled both ways in this corpus)
- `private/realworld/32-party-summary-partial-row` · `impossible-fixture` · p=0.23 · the cast builds a booking with no id, no createdAt and no attendees array at all, a row the type and the writer never produce, and the branch it reaches depends on that missing array
- `private/realworld/34-status-dictionary-coverage` · `vacuous-assertion` · p=0.45 · swapping every invoice label for a shipment one satisfies known, not-the-raw-key, no-underscore and non-empty, so the loop never pins which label belongs to which status
- `private/realworld/35-slot-capacity-positive` · `would-pass-if-broken` · p=0.25 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `private/realworld/assertions-a-sd/02-cross-org-delete-lookup-miss` · `would-pass-if-broken` · p=0.26 · the fixture makes the lookup return null, so it lands on the not-found branch and never reaches the organization_id ownership check the name describes; deleting that check outright leaves every assertion green
- `private/realworld/assertions-a-sd/05-asset-id-domain-separation` · `would-pass-if-broken` · p=0.30 · the two fixtures are not the same figure identity — one carries a locale, the other a branch and a run nonce — so the hashes differ from the extra material alone and dropping the namespace tag that actually prevents collisions leaves the assertion green
- `private/realworld/assertions-a-sd/07-vendored-copy-null-home` · `would-pass-if-broken` · p=0.10 · deleting the guard that keeps a copy with no claimed home slug still leaves it unfolded, because the key built from a null slug matches no home either, so the length assertion cannot tell the guard from its absence
- `private/realworld/assertions-a/06-nullable-not-double-wrapped` · `would-pass-if-broken` · p=0.25 · the one assertion sits behind an Array.isArray guard, and the double-wrap bug the name names produces an anyOf node whose type is undefined — the guard is false, no assertion runs, the test is green
- `private/realworld/assertions-a/09-report-bounds-over-fixture` · `vacuous-assertion` · p=0.48 · past the non-mutation check every assertion is a range any report satisfies — a coverage of 0 with every entry counted as failed passes the same bounds as a fully verified one
- `private/realworld/assertions-a/10-receipt-hidden-while-running` · `would-pass-if-broken` · p=0.13 · the receipt line is gated on cost being present, not on the job running, and the fixture carries no cost at all — remove every running-state check and this assertion still holds
- `private/realworld/assertions-a/12-production-clock` · `vacuous-assertion` · p=0.56 · any Date at or after the line above satisfies both assertions, so a clock returning a timestamp days in the future, or one frozen at the first call, passes unchanged
- `private/realworld/assertions-a/13-floor-points-math` · `assertion-weaker-than-name` · p=0.53 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/13-floor-points-math` · `would-pass-if-broken` · p=0.12 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/14-money-cents-format` · `would-pass-if-broken` · p=0.20 · the exact bug this helper exists to prevent — forgetting the divide by 100 — renders "$2,500.00", which still contains "25" and still matches the currency alternation
- `private/realworld/assertions-a/18-secondary-locale-label` · `would-pass-if-broken` · p=0.14 · the fallback returns the English table name, which is non-empty and is not the code, so a runtime without the secondary-locale data — the case this branch exists for — hands back "Germany" and both assertions still hold
- `private/realworld/assertions-a/19-case-insensitive-search` · `would-pass-if-broken` · p=0.22 · comparing two result counts pins nothing about which entries came back, and dropping the lowercasing on both sides makes both queries return zero rows, which is still an equal length
- `private/realworld/assertions-b-sd/07-ordinary-env-key-allowed` · `vacuous-assertion` · p=0.57 · nothing about the write is checked — an implementation that inserted the wrong key, stored the secret in plaintext, or dropped the deployment targets still resolves to something defined and still calls insert once
- `private/realworld/assertions-b-sd/17-invalid-package-json-rejects` · `swallowed-error-as-success` · p=0.65 · a bare rejects.toThrow() accepts any failure, so a TypeError raised before the parse — or any unrelated throw after the required install — produces the same rejection and the same untouched guide, unlike the sibling that pins /ENOENT/
- `private/realworld/assertions-b/10-occupancy-report-canonical` · `reimplements-logic` · p=0.42 · the expected hour rows are rebuilt in the test by calling the same capacity, interval and bucketing functions the report calls, so a wrong capacity or a shifted hour boundary is computed identically on both sides and the comparison still passes
- `private/realworld/assertions-b/16-archive-fetch-empty-fallback` · `swallowed-error-as-success` · p=0.62 · every failure inside the archive walk is caught and turned into the same empty array, so a domain lookup that returned nothing, a cassette miss, or a crash in the parser all satisfy this assertion just as a network error does
- `private/realworld/assertions-c/06-schema-export-defined` · `would-pass-if-broken` · p=0.27 · `expect(VehicleSchema).toBeDefined()` holds for any non-undefined export, so a schema with every field removed or the wrong shape entirely passes; the import itself already guarantees what the assertion checks
- `private/realworld/assertions-c/10-reasoning-effort-low` · `vacuous-assertion` · p=0.47 · the three sibling effort levels assert the identical thing (truthy text, positive token counts, expect.any(Number) usage), none of which depends on `reasoning.effort` reaching the request body; a doGenerate that dropped providerOptions.gateway on the floor passes all of them
- `private/realworld/mocks-c/18-cache-key-format` · `would-pass-if-broken` · p=0.18 · nothing is faked and nothing from the implementation runs: six literal strings are matched against a regex written in the test, so no asserted value came out of a stub, and any change to how the pipeline actually builds its keys leaves every assertion green
- `private/realworld/mocks-c/19-usage-forwarded` · `happy-path-only-of-risky-boundary` · p=0.52 · the model gateway is the one fake and it is a true external edge; the real generate path re-validates the value against the schema before it forwards usage, and the second assertion reads buildSourcePrefix output that no stub touched
- `private/realworld/mocks-c/24-unfilled-row-shimmer` · `would-pass-if-broken` · p=0.12 · the expected marker is a literal class name, nothing recomputes the unfilled-and-running rule; but with only trims.enumerated landed the still-pending Overview, Specs and History sections render the same pulse class, so a row that never shimmered would leave toContain('animate-pulse') green
- `private/realworld/mocks-sd/13-row-policy-upsert-spy` · `over-mocked` · p=0.48 · the policy write the name promises is only evidenced by a spy on the stubbed persistence call and the admin requirement only by the literal string handed to the stubbed guard, so a guard that ignores its level argument or a write that never commits still passes; every collaborator including the column-type lookup is scripted
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `mocks-seam-under-test` · p=0.55 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `over-mocked` · p=0.33 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/04-whole-amounts-enforced-by-fake` · `mock-mirrors-implementation` · p=0.50 · the test-only client throws on any non-integer amount, so it is the fake, not the production adapter's rounding, that guarantees the asserted invariant
- `private/realworld/mocks/05-coupon-authority-call-args` · `tests-calls-not-outcomes` · p=0.29 · the coupon authority is a vi.fn and the only evidence is the arguments it received, so a resolver that applied the wrong scope, cap or discount amount would leave this test green (mocks-seam-under-test unscored: the smell here is the co-labelled check's shape, not a scripted seam)
- `private/realworld/mocks/08-recovery-dialog-network-stub` · `mocks-seam-under-test` · p=0.78 · every recovery endpoint is fulfilled by page.route, so the recommendation, the settled status and the emptied list are all strings the test wrote; resolveCharge could settle a charge the provider never succeeded and this journey would still pass
- `private/realworld/mocks/11-aggregate-totals-reduce` · `reimplements-logic` · p=0.48 · every expected total is the same summation the function performs, run again in the test, so a bucket added twice or omitted from the aggregate would produce identical numbers on both sides
- `private/realworld/mocks/14-hour-price-label-composed` · `reimplements-logic` · p=0.49 · the label under assertion is assembled in the test with the same template the component uses, so PassPrice could append the unit to every pass, or drop it entirely, without failing anything here
- `private/realworld/mocks/15-agreement-tamper-mock-throws` · `mocks-seam-under-test` · p=0.55 · the tampered content hash is never compared against a published template because acceptAgreementRequest is a vi.fn told to reject, so removing the hash check entirely would not fail this test
- `private/realworld/scope-b-sd/20-price-id-membership` · `trivial-primitive` · p=0.64 · isLocalPriceId is a one-line Set.has over the collection its sibling already tests, so the membership assertion adds nothing a checkout test touching a configured price would not show
- `private/realworld/scope-b/04-default-tab-membership` · `trivial-primitive` · p=0.63 · the block asserts that a constant declared from the same literal union is in that union, which the type system already guarantees and which no runtime change could break without the sibling fallback tests failing first
- `private/realworld/scope-b/09-snapshot-url-builder` · `trivial-primitive` · p=0.67 · both blocks restate a template string and a URLSearchParams call, and the sibling cassette replay drives the same two builders end to end, so a wrong path or missing param fails there first
- `private/realworld/scope-b/20-congruence-always-ok` · `happy-path-only-of-risky-boundary` · p=0.37 · checkEndpointCongruence exists to return ok:false with missingHandlers, missingClaims, invalidPaths or duplicate normalized pairs, and all three blocks only ever assert ok:true, so a version that returned ok unconditionally — losing every incongruence report — would pass every one of them
- `private/realworld/scope-c/16-lone-trim-delta` · `setup-dominates` · p=0.43 · the block's own construction is a full eight-field engine override (code, displacement, aspiration, cylinders, rotors, power, torque, redline) on a single trim, but a single-member cluster hits `cluster.length < 2 → continue` before compareCapability or diffTrims ever read an engine field, so none of those eight values can affect the asserted null deltaFrom
- `private/realworld/scope-c/40-spec-source-uses-shared-builder` · `tests-internals` · p=0.16 · the asserted value is the source text of other test files read off disk with readFileSync, sliced by function name and searched for a call expression; that is peeking at source rather than at any behaviour, and renaming the builder or inlining it breaks the assertion while a fixture that paints-and-exits through a differently named helper does not

## False positives (labelled not_fire, p at or above the check's own threshold)

- `dogfood/19-falls-back-to-the-project-claude-skill` · `reimplements-logic` · p=0.77 · the test asserts WHERE the fallback wrote (project path, not home); comparing the file to skillMarkdown() is a parity check against the generator, not an expected value recomputed with production logic
- `private/realworld/12-gate-bypass-header` · `mocks-seam-under-test` · p=0.86 · the header that actually leaves on the request is read off the real request init, and the scope string handed to the signer is the wire contract a widened bypass would break
- `private/realworld/assertions-a-sd/10-no-entitlement-meter-skipped` · `would-pass-if-broken` · p=0.38 · the loop runs over a fixed meter list rather than the supplied map, so an empty entitlement map really does drive the skip branch, and removing that guard makes the run read undefined usage and attempt a send the assertions forbid
- `private/realworld/assertions-a-sd/17-streak-cleared-on-enforce` · `assertion-weaker-than-name` · p=0.83 · clearing the streak is a call into another module, so the call with the enforced org's id is the observable behaviour the name names, and it fails if the clear is skipped or passed the wrong org
- `private/realworld/assertions-a/02-citation-strip-empty` · `would-pass-if-broken` · p=0.59 · the name promises exactly what the assertion pins — empty in, empty out — so a stripper that threw, returned undefined or emitted whitespace for the empty case fails it
- `private/realworld/assertions-b/23-card-url-cross-origin` · `swallowed-error-as-success` · p=0.73 · null here is an explicit same-origin guard rather than a catch-all landing spot, and the accepting siblings pin the exact returned path, so a parser that stopped refusing foreign origins would fail this block
- `private/realworld/assertions-c/05-two-real-builds-paired` · `would-pass-if-broken` · p=0.44 · the name claims two distinct builds were paired and `expect(preStackMigrate).not.toBe(stackMigrate)` is exactly that claim: if the release checkout resolved to the current module (the realistic failure, which would make every later cell compare a build with itself) the identity comparison fails
- `private/realworld/assertions-c/12-valid-json-response` · `assertion-weaker-than-name` · p=0.84 · the name promises the response parses as valid JSON; doGenerate throws ApiCallError/TypeValidationError on a body that fails JSON.parse or the schema, so reaching the assertions is the whole contract (throw-or-not) and a non-empty text plus finishReason is what a successfully parsed completion looks like
- `private/realworld/assertions-c/16-online-streaming-no-errors` · `assertion-weaker-than-name` · p=0.69 · the name promises only that streaming completes without errors; doStream validates every SSE chunk against StreamChunkSchema and throws TypeValidationError on a chunk whose id is not a string, so the failure this guards is a throw before the assertions, and a non-empty accumulated text is exactly what an error-free stream produces
- `private/realworld/assertions-c/20-event-seq-uniqueness` · `swallowed-error-as-success` · p=0.81 · the rejection is forced by `rejects.toThrow()` and the first appendEvent with seq 1 must resolve before it, while the sibling 'appendEvent allocates monotonic seqs' pins appendEvent returning 1 then 2, so an implementation that threw on every insert could not stay green; the bare toThrow is loose but the failure path is provably reached and distinguished
- `private/realworld/mocks-c/19-usage-forwarded` · `over-mocked` · p=0.71 · the model gateway is the one fake and it is a true external edge; the real generate path re-validates the value against the schema before it forwards usage, and the second assertion reads buildSourcePrefix output that no stub touched
- `private/realworld/mocks-sd/09-forwards-transition-target` · `mocks-seam-under-test` · p=0.88 · the named behaviour is that the handler forwards every admin target rather than filtering any of them out, and that is decided by the handler's own schema and call site — a schema narrowed to a subset makes the 400 branch fire and the assertion fail, while the legality decision the stub stands in for is deliberately not what is asserted
- `private/realworld/scope-a/10-endpoint-manifest-congruence` · `tests-internals` · p=0.46 · the handler registry and the shipped manifest are two artifacts a router serves from, and the assertion is that they agree exactly — a declared route with no handler is a 404 in production
- `private/realworld/scope-b-sd/17-merge-request-key-prefix` · `trivial-primitive` · p=0.84 · the literal is a persisted encoding: the round-trip sibling stays green for any prefix because both halves change together, so only this assertion catches a rename that orphans every merge-request row already in the database
- `private/realworld/scope-b/05-greeting-hour-buckets` · `trivial-primitive` · p=0.76 · the three blocks pin both bucket boundaries (11 vs 12, 17 vs 18) of a time-of-day split whose only caller reads the wall clock, so an off-by-one there would render a plausible-looking greeting that no wider test could observe
- `private/realworld/scope-b/08-sse-frame-format` · `trivial-primitive` · p=0.74 · this pins a wire-format encoding whose separators are load-bearing — drop the blank line after data and every frame stops being dispatched to clients, a break the sibling replay tests read straight out of the log and never see
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

### `changed-in-lockstep`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline (round 4) | 0.91 | 1.00 | no |
| new-code gate (all-additions test file) + pair-expectation-to-impl-line (full-run numbers) | 0.96 | 1.00 | yes |

## Cost

565166 input tokens ≈ $0.0237 for the full corpus (868 cases, ~651 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
