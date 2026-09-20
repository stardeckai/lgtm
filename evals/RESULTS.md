# lgtm eval results

783 labelled cases (521 public + 262 private, synthetic + anonymized real-world) · 1482 scored (check, case) pairs · model `jev-1.13.0`

Split: 618 train · 165 holdout.

## Per check

| check | pos | neg | own t | train P/R/F1 @own | holdout P/R/F1 @own | P/R/F1 @0.50 | best F1 (train) |
|---|---|---|---|---|---|---|---|
| `would-pass-if-broken` | 57 | 42 | 0.60 | 1.00/0.51/0.68 | 0.83/0.36/0.50 | 0.97/0.54/0.70 | 0.88 @ 0.23 |
| `vacuous-assertion` | 39 | 140 | 0.70 | 1.00/0.71/0.83 | 1.00/0.63/0.77 | 0.92/0.90/0.91 | 0.92 @ 0.38 |
| `assertion-weaker-than-name` | 60 | 22 | 0.60 | 0.98/0.94/0.96 | 1.00/1.00/1.00 | 0.92/0.95/0.93 | 0.96 @ 0.61 |
| `reimplements-logic` | 30 | 176 | 0.85 | 1.00/0.71/0.83 | 1.00/0.50/0.67 | 0.81/1.00/0.90 | 0.98 @ 0.62 |
| `mocks-seam-under-test` | 26 | 95 | 0.80 | 1.00/0.20/0.33 | 1.00/0.33/0.50 | 0.73/0.92/0.81 | 0.88 @ 0.65 |
| `mock-mirrors-implementation` | 18 | 18 | 0.60 | 1.00/0.93/0.96 | 1.00/0.50/0.67 | 0.95/1.00/0.97 | 0.97 @ 0.50 |
| `tests-calls-not-outcomes` | 23 | 51 | 0.65 | 1.00/0.84/0.91 | 1.00/1.00/1.00 | 0.95/0.91/0.93 | 0.94 @ 0.53 |
| `tests-internals` | 23 | 41 | 0.65 | 1.00/0.67/0.80 | 0.80/0.80/0.80 | 0.91/0.87/0.89 | 0.95 @ 0.33 |
| `setup-dominates` | 16 | 44 | 0.60 | 1.00/0.92/0.96 | 1.00/1.00/1.00 | 0.94/1.00/0.97 | 1.00 @ 0.53 |
| `broad-snapshot` | 16 | 35 | 0.35 | 1.00/0.92/0.96 | 1.00/1.00/1.00 | 1.00/0.81/0.90 | 1.00 @ 0.22 |
| `swallowed-error-as-success` | 24 | 52 | 0.80 | 1.00/0.37/0.54 | 1.00/0.80/0.89 | 0.92/0.92/0.92 | 0.92 @ 0.57 |
| `impossible-fixture` | 16 | 47 | 0.55 | 1.00/0.67/0.80 | 1.00/1.00/1.00 | 1.00/0.88/0.93 | 0.91 @ 0.52 |
| `happy-path-only-of-risky-boundary` | 22 | 66 | 0.70 | 1.00/0.50/0.67 | 1.00/0.50/0.67 | 0.83/0.86/0.84 | 0.88 @ 0.61 |
| `trivial-primitive` | 32 | 90 | 0.85 | 1.00/0.64/0.78 | 1.00/0.71/0.83 | 0.80/1.00/0.89 | 0.93 @ 0.57 |
| `over-mocked` | 24 | 60 | 0.55 | 0.89/0.42/0.57 | 1.00/0.20/0.33 | 0.92/0.50/0.65 | 0.86 @ 0.34 |
| `regression-does-not-distinguish` | 17 | 24 | 0.35 | 1.00/0.85/0.92 | 1.00/0.75/0.86 | 1.00/0.76/0.87 | 0.96 @ 0.23 |
| `changed-in-lockstep` | 16 | 20 | 0.75 | 1.00/0.92/0.96 | 1.00/1.00/1.00 | 0.89/1.00/0.94 | 1.00 @ 0.74 |

Holdout is one stratified draw per case, ~20% (165); with ~3 held-out positives per check its numbers are a sanity check against overfitting, not a precise estimate.

Checks with no labelled case are omitted.

## Test class

Accuracy — all: 668/783 (0.85) · holdout: 140/165 (0.85).

| actual \ predicted | pure_logic | mocked_seam_unit | contract_integration |
|---|---|---|---|
| **pure_logic** | 445 | 54 | 14 |
| **mocked_seam_unit** | 0 | 132 | 7 |
| **contract_integration** | 25 | 15 | 91 |

## Misses (labelled fire, p below the check's own threshold)

- `broad-snapshot/11-schedule-lunch-break` · `broad-snapshot` · p=0.22 · the recorded list of seven slot objects hides the only thing that matters, the single missing midday entry, which one expected array of gaps would state outright
- `changed-in-lockstep/01-late-fee-grace-period` · `changed-in-lockstep` · p=0.74 · the grace boundary moved by one day and the test's literals were shifted by one day to match it, so the test no longer states the billing rule
- `happy-path-only-of-risky-boundary/04-tenant-scoped-document-read` · `happy-path-only-of-risky-boundary` · p=0.67 · read hides documents belonging to another organisation, and every block reads within one organisation — the unknown-id sibling exercises a different branch
- `happy-path-only-of-risky-boundary/07-reserve-inventory-optimistic-lock` · `happy-path-only-of-risky-boundary` · p=0.52 · the version column exists to reject a second concurrent reservation built on a stale read, and every block passes the current version
- `happy-path-only-of-risky-boundary/08-api-key-scope-check` · `happy-path-only-of-risky-boundary` · p=0.65 · the two refusals that matter — a missing scope and a revoked key — are never exercised here or in any sibling, which all use the same fully scoped live key
- `happy-path-only-of-risky-boundary/09-file-upload-quota` · `happy-path-only-of-risky-boundary` · p=0.69 · the sibling covers the mime refusal but nothing anywhere pushes an upload past the storage limit, which is the refusal that decides whether a paying tenant can keep writing
- `happy-path-only-of-risky-boundary/10-coupon-redemption` · `happy-path-only-of-risky-boundary` · p=0.25 · the siblings cover expiry and a second customer, but the once-per-customer refusal — the same customer redeeming twice — is never exercised
- `happy-path-only-of-risky-boundary/11-refund-exceeds-capture` · `happy-path-only-of-risky-boundary` · p=0.53 · the sibling covers an unknown charge id, but nothing ever refunds more than was captured, which is the refusal that stops money leaving twice
- `happy-path-only-of-risky-boundary/12-schedule-shift-overlap` · `happy-path-only-of-risky-boundary` · p=0.29 · the siblings cover a backwards shift and two shifts that do not touch, but nothing ever double-books the same staff member, which is the clash the roster exists to refuse
- `happy-path-only-of-risky-boundary/13-role-downgrade-last-owner` · `happy-path-only-of-risky-boundary` · p=0.68 · the sibling covers an unknown member, but nothing demotes the only owner, which is the refusal that keeps an organisation from locking everyone out
- `happy-path-only-of-risky-boundary/14-queue-visibility-timeout` · `happy-path-only-of-risky-boundary` · p=0.61 · redelivery after the visibility window and the move to the dead-letter list on the fourth receive are the risky paths, and every block here acks or drains on the first receive
- `impossible-fixture/07-booking-next-free-slot` · `impossible-fixture` · p=0.52 · book() rejects overlapping bookings, so only rows pushed straight in through seedRaw can make a room read as busy for 240 minutes out of a 180-minute span
- `impossible-fixture/08-chat-message-preview` · `impossible-fixture` · p=0.53 · acceptIncoming rejects an empty body, so the last message in the fixture is one the send path can never store and the expected empty preview describes an unreachable thread
- `impossible-fixture/15-document-revision-diff` · `impossible-fixture` · p=0.18 · append always numbers revisions contiguously, so a log that jumps from revision 1 to revision 4 — and therefore has no revision 2 to compare against — is a history the editor cannot write
- `mock-mirrors-implementation/03-fx-conversion` · `mock-mirrors-implementation` · p=0.54 · the fake converter reproduces the real converter's minor-unit scaling and rounding, so the zero-decimal currency handling under test lives entirely in the stub
- `mock-mirrors-implementation/13-price-rules-engine` · `mock-mirrors-implementation` · p=0.50 · the rule data is realistic but the engine beside it duplicates the match predicate, the descending sort and the take-one that make the no-stacking behaviour true
- `mocks-seam-under-test/01-order-repository-write` · `mocks-seam-under-test` · p=0.78 · the repository whose write is the behaviour under test is itself the mock, and the only evidence is that the mock was called
- `mocks-seam-under-test/04-signature-verifier-stub` · `mocks-seam-under-test` · p=0.79 · the signature check the test name is about is replaced by a stub hardcoded to return false, so the real hmac comparison is never exercised
- `mocks-seam-under-test/05-queue-both-sides` · `mocks-seam-under-test` · p=0.65 · the producer's publish is discarded and the consumer reads a hand-written envelope, so the two sides agree because the test wrote both
- `mocks-seam-under-test/07-permission-check-stub` · `mocks-seam-under-test` · p=0.76 · the authorization function whose refusal the test names is itself mocked to reject, so the real role table is never consulted
- `mocks-seam-under-test/08-tenant-isolation-query` · `mocks-seam-under-test` · p=0.72 · the tenant filter lives in the gateway query, and that query is mocked to return only one tenant's rows, so the isolation claim is true of the fake by construction
- `mocks-seam-under-test/09-serializer-roundtrip` · `mocks-seam-under-test` · p=0.79 · both halves of the encode/decode pair the test claims to round trip are mocks wired to return the matching literal and object
- `mocks-seam-under-test/10-outbox-transaction` · `mocks-seam-under-test` · p=0.68 · the transaction whose atomicity is the point of the test is entirely fake, so nothing would notice if the two writes landed in separate transactions
- `mocks-seam-under-test/11-upload-checksum-among-mocks` · `mocks-seam-under-test` · p=0.71 · the clock, metrics and logger fakes are fair, but the store's checksum is also faked, so the local-versus-remote digest comparison the test names can never disagree
- `mocks-seam-under-test/14-idempotency-key-store` · `mocks-seam-under-test` · p=0.72 · the deduplication depends on the store remembering the first write, and the store is a mock scripted to return the stored response whether or not anything was written
- `mocks-seam-under-test/16-migration-journal` · `mocks-seam-under-test` · p=0.71 · what makes a migration run once is that recording it changes what the journal reports, and both the read and the write of that journal are fakes that never influence each other
- `over-mocked/01-invite-route-handler` · `over-mocked` · p=0.48 · auth, validation, persistence and mail are all replaced, so only the handler's four lines of glue are real
- `over-mocked/02-refund-orchestrator` · `over-mocked` · p=0.50 · every collaborator is a stub tuned so the policy limit and the outstanding balance coincide, leaving no real decision to fail
- `over-mocked/04-document-export` · `would-pass-if-broken` · p=0.47 · all four collaborators are stubs and the asserted url is the stub's own return, so a wrong storage key passes
- `over-mocked/06-graphql-resolver` · `over-mocked` · p=0.52 · the loader, the permission check and the database are all stubbed to agree, and the assertion echoes the loader's own object
- `over-mocked/07-self-mocked-helpers` · `over-mocked` · p=0.39 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/07-self-mocked-helpers` · `would-pass-if-broken` · p=0.53 · the version bump and manifest building are stubbed out, so choosing a patch bump for 40 files would still report 2.4.0
- `over-mocked/09-price-quote` · `over-mocked` · p=0.36 · all three rule modules that decide the rates are stubbed, leaving only the multiply-and-add glue real
- `over-mocked/10-notification-preferences` · `over-mocked` · p=0.20 · the only real code is a constant lookup, since preferences, templates and every transport are stubs that always succeed
- `over-mocked/13-sync-service-class` · `over-mocked` · p=0.23 · the sheet reader, the mapper that decides which rows survive and the store are all stubs kept consistent by hand
- `over-mocked/14-dunning-email` · `over-mocked` · p=0.35 · the eligibility decision and the attempt counter are both stubbed, so only string interpolation is left running
- `over-mocked/15-transaction-wrapper` · `over-mocked` · p=0.35 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `over-mocked/15-transaction-wrapper` · `mocks-seam-under-test` · p=0.58 · the transaction, every query builder and the schema are fakes, so the seat move and audit row are never really written or read
- `regression-does-not-distinguish/07-reset-token-expiry` · `regression-does-not-distinguish` · p=0.13 · the second redeem is refused only because the token was already used, so the pre-fix code without any TTL check returns the same values
- `regression-does-not-distinguish/13-mention-at-line-start` · `assertion-weaker-than-name` · p=0.30 · every mention in the three strings is preceded by a space, so the pre-fix pattern that required leading whitespace returns the same arrays
- `regression-does-not-distinguish/15-admin-implies-billing-read` · `regression-does-not-distinguish` · p=0.23 · the admin fixture carries an explicit billing:read grant, so the first assertion is satisfied by the grant list and never reaches the role table the fix changed
- `regression-does-not-distinguish/16-csv-embedded-quote` · `regression-does-not-distinguish` · p=0.24 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `regression-does-not-distinguish/16-csv-embedded-quote` · `assertion-weaker-than-name` · p=0.34 · no field in the test contains a double quote, so the pre-fix wrapper that never doubled quotes produces the same three rows
- `reimplements-logic/10-currency-rounding-helper` · `reimplements-logic` · p=0.84 · the expected payouts are produced by calling the same rounding helper the implementation calls with the same basis-point arithmetic, so a broken half-even rule passes
- `setup-dominates/04-session-ttl-seconds` · `setup-dominates` · p=0.53 · five module mocks, a tenant, a device and an actor sit in file context for a pure arithmetic assertion that touches none of them
- `swallowed-error-as-success/01-duplicate-signup-try-catch` · `would-pass-if-broken` · p=0.33 · if the duplicate check disappeared the second register would return an account, the catch would never run and the test would still be green
- `swallowed-error-as-success/02-config-parse-fallback` · `swallowed-error-as-success` · p=0.63 · a parseConfig that ignored its input entirely and always returned the defaults would pass this test unchanged
- `swallowed-error-as-success/03-webhook-signature-logged` · `swallowed-error-as-success` · p=0.68 · a crash anywhere in the handler produces the same null and the same logged error, so the test cannot tell a rejected signature from a broken function
- `swallowed-error-as-success/04-bulk-import-not-to-throw` · `swallowed-error-as-success` · p=0.59 · the only assertion is that nothing threw, which importing every row unchecked would also satisfy
- `swallowed-error-as-success/05-payment-error-message-contains` · `vacuous-assertion` · p=0.50 · any error message satisfies the catch and an authorization that wrongly succeeded would skip the catch entirely, leaving nothing asserted
- `swallowed-error-as-success/06-result-ok-false-only` · `swallowed-error-as-success` · p=0.74 · an unknown account, a thrown exception and an overdraft all produce the identical ok false, and no balance is read back to show nothing moved
- `swallowed-error-as-success/07-search-fallback-to-cache` · `swallowed-error-as-success` · p=0.71 · a search that never called the backend and always returned the cached array would pass this test unchanged
- `swallowed-error-as-success/08-async-rejection-unawaited` · `vacuous-assertion` · p=0.45 · a dispatcher that accepted the empty payload would skip the catch and still satisfy a count assertion that every integer meets
- `swallowed-error-as-success/09-retry-gives-up` · `swallowed-error-as-success` · p=0.61 · the fallback comes back whether the helper retried three times or gave up immediately, and the attempt count the name promises is never checked
- `swallowed-error-as-success/10-import-error-count` · `swallowed-error-as-success` · p=0.29 · any exception raised while parsing the second row produces one error and one parsed row, so the counts do not distinguish the date rule from an unrelated crash
- `swallowed-error-as-success/12-route-returns-200-on-failure` · `swallowed-error-as-success` · p=0.64 · the catch also answers 200 with an empty rows array, so a thrown error inside the handler is indistinguishable from the range check the test is named for
- `swallowed-error-as-success/15-empty-list-for-unknown-tenant` · `swallowed-error-as-success` · p=0.57 · the catch logs and returns the same empty array, so a filter that crashed would look exactly like the tenant scoping this test is named for
- `tests-calls-not-outcomes/13-migration-ordering` · `tests-calls-not-outcomes` · p=0.53 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-calls-not-outcomes/13-migration-ordering` · `would-pass-if-broken` · p=0.30 · only the first backfill is compared to the drop, so stopping after one of the three batches keeps the test green
- `tests-calls-not-outcomes/15-session-revocation` · `would-pass-if-broken` · p=0.47 · expect.any(String) for the session id means revoking the session that was meant to be kept still passes
- `tests-internals/04-handler-source-text` · `would-pass-if-broken` · p=0.57 · it greps the function's source text, so an org-wide lookup that leaked members across tenants would still pass
- `tests-internals/06-import-pipeline-order` · `tests-internals` · p=0.62 · it pins the internal order of three private pipeline steps and never looks at the deduplicated contacts returned
- `tests-internals/07-child-props-spy` · `tests-internals` · p=0.35 · it counts renders of a stubbed child component instead of asserting the tax and total amounts shown to the shopper
- `tests-internals/10-reducer-dispatch-spy` · `tests-internals` · p=0.62 · it asserts the sequence of internal action types while the reducer that enforces the four-seat limit never runs
- `tests-internals/11-draft-hook-ref` · `tests-internals` · p=0.64 · the assertion is on a bookkeeping ref rather than the status the UI renders or the draft handed to save
- `tests-internals/12-dedupe-window-size` · `tests-internals` · p=0.43 · it asserts the size of the internal bookkeeping map instead of whether a repeated event id is accepted again
- `tests-internals/13-permission-table-shape` · `tests-internals` · p=0.58 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `tests-internals/13-permission-table-shape` · `would-pass-if-broken` · p=0.17 · it asserts the shape of a lookup table, so adding billing to the admin row would leave the test green
- `trivial-primitive/03-initials-from-name` · `trivial-primitive` · p=0.84 · a one-line split-and-take-first-letter with no edge cases, exercised by any test that renders a contact card
- `trivial-primitive/09-session-lookup-wrapper` · `trivial-primitive` · p=0.67 · find is a one-line wrapper over Map.get with a null fallback, and every activeUserId test exercises it already
- `trivial-primitive/12-analytics-client-wrapper` · `trivial-primitive` · p=0.80 · track only forwards its two arguments unchanged, and any trackPurchase test — where the payload is actually built — exercises that forwarding as well
- `trivial-primitive/14-tasks-by-due-date` · `trivial-primitive` · p=0.57 · a one-line sort on an already-sortable ISO date string, and any test of the upcoming column would show tasks coming out in the wrong order
- `trivial-primitive/15-widget-config-defaults` · `trivial-primitive` · p=0.83 · the function is one object spread over a constant, and any embed-snippet test would show a default that failed to apply
- `vacuous-assertion/12-incident-notification` · `vacuous-assertion` · p=0.57 · toContain passes for a list that also pages the whole directory, which is exactly what the word only rules out
- `would-pass-if-broken/05-tenant-ticket-listing` · `would-pass-if-broken` · p=0.23 · every seeded ticket belongs to acme, so dropping the tenant filter entirely leaves the asserted id list unchanged
- `would-pass-if-broken/09-inventory-reservation` · `would-pass-if-broken` · p=0.46 · 3 units are requested against 10 available, so replacing the clamp with a plain assignment produces the same asserted object
- `would-pass-if-broken/10-rate-limit-window` · `would-pass-if-broken` · p=0.43 · only three calls are made against a limit of five, so a limiter that never resets its window returns true for all three anyway
- `would-pass-if-broken/11-deep-merge-config` · `would-pass-if-broken` · p=0.45 · both objects are flat, so replacing the recursive merge with a shallow spread produces exactly the asserted result
- `would-pass-if-broken/12-next-business-day` · `would-pass-if-broken` · p=0.23 · 2026-03-03 is a Tuesday so the next day is already a weekday, and removing the weekend skip still yields 2026-03-04
- `would-pass-if-broken/13-document-permissions` · `would-pass-if-broken` · p=0.43 · the admin in the fixture is also the owner, so the owner branch returns true first and deleting the admin rule changes nothing
- `would-pass-if-broken/14-upload-content-type` · `would-pass-if-broken` · p=0.19 · the file is also named .png, so removing the magic-byte scan entirely still resolves image/png through the extension table
- `would-pass-if-broken/15-shipment-split` · `would-pass-if-broken` · p=0.59 · the first warehouse stocks the whole order, so the carry-over logic the name describes never executes and could be deleted
- `private/realworld/01-signed-header-base64` · `vacuous-assertion` · p=0.63 · any JSON object at all satisfies toBeDefined, so a header that encoded the wrong workspace, the wrong app or no claims but one stray key would still pass
- `private/realworld/03-rate-limit-try-catch` · `swallowed-error-as-success` · p=0.14 · nothing forces the catch block to run, so a client that returned normally on a 429 instead of throwing would leave this test green with zero assertions executed
- `private/realworld/05-duplicate-workspace-roles` · `over-mocked` · p=0.20 · eight collaborators covering the whole duplication path are stubbed and forty lines of setup lead to one not-called assertion, so nothing about the copied app, the repository fork or the remapped role grants could fail here (setup-dominates unscored: every stub is read by the exercised path; the smell is the over-mocked one)
- `private/realworld/15-merge-commit-protocol` · `mocks-seam-under-test` · p=0.40 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `private/realworld/15-merge-commit-protocol` · `tests-calls-not-outcomes` · p=0.27 · the merge protocol the test claims to check lives in the workspace, and the workspace is a stub that accepts any flag combination, so the real refusal to conclude a merge the caller never claimed is never exercised and no resulting state is asserted
- `private/realworld/24-document-schema-content-hash` · `reimplements-logic` · p=0.81 · the expected hash is produced by calling the same hashing function the code under test calls, so any change to canonicalization or digest keeps both sides equal
- `private/realworld/26-receipt-total-lines` · `reimplements-logic` · p=0.64 · every expected column is produced by the same formatter the renderer uses and the grand total is recomputed in the test with the production arithmetic, so a wrong separator or a flipped discount sign agrees on both sides
- `private/realworld/31-gateway-webhook-other-events` · `would-pass-if-broken` · p=0.36 · the handler returns undefined on every path, so dropping the event-type guard and settling the seeded invoice would leave this assertion green
- `private/realworld/31-gateway-webhook-other-events` · `vacuous-assertion` · p=0.38 · the handler returns undefined on every path, so dropping the event-type guard and settling the seeded invoice would leave this assertion green
- `private/realworld/32-party-summary-partial-row` · `impossible-fixture` · p=0.20 · the cast builds a booking with no id, no createdAt and no attendees array at all, a row the type and the writer never produce, and the branch it reaches depends on that missing array
- `private/realworld/33-consent-evidence-binding` · `mocks-seam-under-test` · p=0.65 · the consent store whose write is the behaviour the name claims is itself the mock, so nothing checks that evidence is actually recorded against the booking
- `private/realworld/34-status-dictionary-coverage` · `vacuous-assertion` · p=0.27 · swapping every invoice label for a shipment one satisfies known, not-the-raw-key, no-underscore and non-empty, so the loop never pins which label belongs to which status
- `private/realworld/35-slot-capacity-positive` · `vacuous-assertion` · p=0.52 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `private/realworld/35-slot-capacity-positive` · `would-pass-if-broken` · p=0.25 · capacityFor falls back to a positive default for any key, so mis-formatting every slot key would still produce slots whose capacity is greater than zero
- `private/realworld/assertions-a-sd/02-cross-org-delete-lookup-miss` · `would-pass-if-broken` · p=0.39 · the fixture makes the lookup return null, so it lands on the not-found branch and never reaches the organization_id ownership check the name describes; deleting that check outright leaves every assertion green
- `private/realworld/assertions-a-sd/03-migration-target-semver-gte` · `vacuous-assertion` · p=0.52 · the package version only ever moves up, so gte against a frozen literal is satisfied by every future release; if the migration were retargeted at a version that was never published the assertion would still hold and the deploy-time install would be the first thing to fail (would-pass-if-broken unscored: no named behaviour to break here; the smell belongs to another check)
- `private/realworld/assertions-a-sd/05-asset-id-domain-separation` · `would-pass-if-broken` · p=0.36 · the two fixtures are not the same figure identity — one carries a locale, the other a branch and a run nonce — so the hashes differ from the extra material alone and dropping the namespace tag that actually prevents collisions leaves the assertion green
- `private/realworld/assertions-a-sd/07-vendored-copy-null-home` · `would-pass-if-broken` · p=0.40 · deleting the guard that keeps a copy with no claimed home slug still leaves it unfolded, because the key built from a null slug matches no home either, so the length assertion cannot tell the guard from its absence
- `private/realworld/assertions-a/06-nullable-not-double-wrapped` · `would-pass-if-broken` · p=0.34 · the one assertion sits behind an Array.isArray guard, and the double-wrap bug the name names produces an anyOf node whose type is undefined — the guard is false, no assertion runs, the test is green
- `private/realworld/assertions-a/09-report-bounds-over-fixture` · `vacuous-assertion` · p=0.53 · past the non-mutation check every assertion is a range any report satisfies — a coverage of 0 with every entry counted as failed passes the same bounds as a fully verified one
- `private/realworld/assertions-a/10-receipt-hidden-while-running` · `would-pass-if-broken` · p=0.34 · the receipt line is gated on cost being present, not on the job running, and the fixture carries no cost at all — remove every running-state check and this assertion still holds
- `private/realworld/assertions-a/11-managed-icon-for-named-glyphs` · `would-pass-if-broken` · p=0.47 · the builder never inspects the icon field at all — every input gets the same fallback entry — so the icon half of the assertion is satisfied by the default and only the start_url half could ever fail
- `private/realworld/assertions-a/12-production-clock` · `vacuous-assertion` · p=0.45 · any Date at or after the line above satisfies both assertions, so a clock returning a timestamp days in the future, or one frozen at the first call, passes unchanged
- `private/realworld/assertions-a/13-floor-points-math` · `assertion-weaker-than-name` · p=0.47 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/13-floor-points-math` · `would-pass-if-broken` · p=0.14 · the only inexact case is 3.49, which rounds and truncates to the same 3, and no negative spend is tried — swapping the floor for Math.round or Math.trunc keeps all three assertions green
- `private/realworld/assertions-a/14-money-cents-format` · `would-pass-if-broken` · p=0.41 · the exact bug this helper exists to prevent — forgetting the divide by 100 — renders "$2,500.00", which still contains "25" and still matches the currency alternation
- `private/realworld/assertions-a/15-card-url-locale-length` · `would-pass-if-broken` · p=0.55 · the segment contains digits, so it is refused by the character rule long before any length rule is consulted — widen the length bound to twenty and this still returns null
- `private/realworld/assertions-a/18-secondary-locale-label` · `vacuous-assertion` · p=0.68 · the fallback returns the English table name, which is non-empty and is not the code, so a runtime without the secondary-locale data — the case this branch exists for — hands back "Germany" and both assertions still hold
- `private/realworld/assertions-a/18-secondary-locale-label` · `would-pass-if-broken` · p=0.46 · the fallback returns the English table name, which is non-empty and is not the code, so a runtime without the secondary-locale data — the case this branch exists for — hands back "Germany" and both assertions still hold
- `private/realworld/assertions-a/19-case-insensitive-search` · `vacuous-assertion` · p=0.60 · comparing two result counts pins nothing about which entries came back, and dropping the lowercasing on both sides makes both queries return zero rows, which is still an equal length
- `private/realworld/assertions-a/19-case-insensitive-search` · `would-pass-if-broken` · p=0.43 · comparing two result counts pins nothing about which entries came back, and dropping the lowercasing on both sides makes both queries return zero rows, which is still an equal length
- `private/realworld/assertions-a/22-lifecycle-eligible-projection` · `would-pass-if-broken` · p=0.33 · the fixture carries no competing member signal, so nothing establishes which projection wins — the assertion only reads back the boolean the test itself put in, which a pass-through parser satisfies
- `private/realworld/assertions-a/23-venue-timezone-format` · `would-pass-if-broken` · p=0.35 · the timezone the name is about is never observed — drop it and render in UTC and the output still contains the year, which is all the assertion looks at
- `private/realworld/assertions-b-sd/17-invalid-package-json-rejects` · `swallowed-error-as-success` · p=0.64 · a bare rejects.toThrow() accepts any failure, so a TypeError raised before the parse — or any unrelated throw after the required install — produces the same rejection and the same untouched guide, unlike the sibling that pins /ENOENT/
- `private/realworld/assertions-b-sd/18-scrub-error-false` · `swallowed-error-as-success` · p=0.70 · false is the same value a non-zero exit produces, so nothing in the assertion distinguishes the transport rejection from any other failure, or from a scrub that never ran the command at all
- `private/realworld/assertions-b/10-occupancy-report-canonical` · `reimplements-logic` · p=0.84 · the expected hour rows are rebuilt in the test by calling the same capacity, interval and bucketing functions the report calls, so a wrong capacity or a shifted hour boundary is computed identically on both sides and the comparison still passes
- `private/realworld/assertions-b/16-archive-fetch-empty-fallback` · `swallowed-error-as-success` · p=0.64 · every failure inside the archive walk is caught and turned into the same empty array, so a domain lookup that returned nothing, a cassette miss, or a crash in the parser all satisfy this assertion just as a network error does
- `private/realworld/mocks-sd/02-attachment-cache-key` · `reimplements-logic` · p=0.75 · the expected value is built by re-joining mediaType and the key material with the same newline separator and hashing it the same way, so a separator change or a field swap that breaks the cross-app cache key would be copied into the expectation instead of failing
- `private/realworld/mocks-sd/03-token-cache-key-parity` · `reimplements-logic` · p=0.78 · the expected digest is built from the same `id:scope:token` concatenation the helper uses, so reordering those fields — the exact drift this cross-process key is supposed to pin — would be written into both sides at once; nothing is mocked here, so there is no mock re-encoding the implementation
- `private/realworld/mocks-sd/06-portal-token-hash` · `reimplements-logic` · p=0.77 · the expected token_hash is recomputed with the same sha256-hex call the builder makes, so swapping the digest or hashing the wrong column would be mirrored into the expectation; only the no-plaintext and prefix assertions beside it could still fail
- `private/realworld/mocks-sd/07-cron-guard-branch` · `mocks-seam-under-test` · p=0.75 · whether a request counts as an authenticated cron worker is decided entirely by the stubbed guard, so a guard that compares the wrong header or accepts a missing secret still produces a green test, and the only unmocked code left is the if-branch and a passthrough of the stub's own count
- `private/realworld/mocks-sd/13-row-policy-upsert-spy` · `mocks-seam-under-test` · p=0.71 · the policy write the name promises is only evidenced by a spy on the stubbed persistence call and the admin requirement only by the literal string handed to the stubbed guard, so a guard that ignores its level argument or a write that never commits still passes; every collaborator including the column-type lookup is scripted
- `private/realworld/mocks-sd/16-destinations-passthrough` · `over-mocked` · p=0.50 · the guard and the notification module are both first-party stubs, so the only real code left is a try/catch and handing the stub's own object back as JSON — the asserted body is literally the value the mock was configured to return and nothing about how destinations are assembled can fail
- `private/realworld/mocks-sd/16-destinations-passthrough` · `mocks-seam-under-test` · p=0.75 · the guard and the notification module are both first-party stubs, so the only real code left is a try/catch and handing the stub's own object back as JSON — the asserted body is literally the value the mock was configured to return and nothing about how destinations are assembled can fail
- `private/realworld/mocks-sd/19-readonly-role-mint` · `over-mocked` · p=0.44 · every collaborator the handler calls — access check, connection and branch reads, role provisioning, the mapping writes and even the advisory-lock wrapper — is a stub, so the assertions only check that one stub's return value was passed to the next; no real role is minted and no two components could disagree about what a SELECT-only credential is
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `mocks-seam-under-test` · p=0.54 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/03-member-basis-quote-fake-client` · `over-mocked` · p=0.29 · the basis and the total are both produced by the test-only catalog client, so the real quoting authority could charge the standard rate for a member renewal and this test would still see basis member and the member total
- `private/realworld/mocks/04-whole-amounts-enforced-by-fake` · `mock-mirrors-implementation` · p=0.51 · the test-only client throws on any non-integer amount, so it is the fake, not the production adapter's rounding, that guarantees the asserted invariant
- `private/realworld/mocks/05-coupon-authority-call-args` · `over-mocked` · p=0.34 · the coupon authority is a vi.fn and the only evidence is the arguments it received, so a resolver that applied the wrong scope, cap or discount amount would leave this test green (mocks-seam-under-test unscored: the smell here is the co-labelled check's shape, not a scripted seam)
- `private/realworld/mocks/05-coupon-authority-call-args` · `tests-calls-not-outcomes` · p=0.29 · the coupon authority is a vi.fn and the only evidence is the arguments it received, so a resolver that applied the wrong scope, cap or discount amount would leave this test green (mocks-seam-under-test unscored: the smell here is the co-labelled check's shape, not a scripted seam)
- `private/realworld/mocks/06-order-submit-passthrough` · `over-mocked` · p=0.38 · the ordering service that mints the display number and validates the lines is a vi.fn, so what remains real is forwarding the request and prefixing the returned number with a hash
- `private/realworld/mocks/07-account-panel-slot-stub` · `mocks-seam-under-test` · p=0.65 · both the heading strings and the contributed panel come from the mocked module, so the registry could resolve no contributor at all and the page would still render the stub's markup; the stub is a plain echo rather than a copy of the resolver
- `private/realworld/mocks/08-recovery-dialog-network-stub` · `mocks-seam-under-test` · p=0.70 · every recovery endpoint is fulfilled by page.route, so the recommendation, the settled status and the emptied list are all strings the test wrote; resolveCharge could settle a charge the provider never succeeded and this journey would still pass
- `private/realworld/mocks/11-aggregate-totals-reduce` · `reimplements-logic` · p=0.83 · every expected total is the same summation the function performs, run again in the test, so a bucket added twice or omitted from the aggregate would produce identical numbers on both sides
- `private/realworld/mocks/13-jsonld-verified-offer-count` · `reimplements-logic` · p=0.62 · the expected offer count is produced by calling the very filter buildCarJsonLd uses, so dropping the unknown-market condition from verifiedOffersForSeo would publish unsubstantiated prices and still agree on both sides; the loop below only checks sold-and-unverified offerings
- `private/realworld/mocks/14-hour-price-label-composed` · `reimplements-logic` · p=0.77 · the label under assertion is assembled in the test with the same template the component uses, so PassPrice could append the unit to every pass, or drop it entirely, without failing anything here
- `private/realworld/mocks/15-agreement-tamper-mock-throws` · `mocks-seam-under-test` · p=0.48 · the tampered content hash is never compared against a published template because acceptAgreementRequest is a vi.fn told to reject, so removing the hash check entirely would not fail this test
- `private/realworld/scope-a-sd/09-policy-sample-fields` · `tests-internals` · p=0.33 · this block never calls either strip function: it only checks that the table's field names appear on fixtures written in the same file, so a policy that names a field the real tool payload never carries still passes as long as the local sample carries it
- `private/realworld/scope-b-sd/18-budget-presets` · `trivial-primitive` · p=0.81 · the assertion copies an exported array literal back onto itself; the presets have no behaviour of their own, and any test of the picker that renders them would show a missing or reordered option
- `private/realworld/scope-b-sd/19-verification-message-map` · `trivial-primitive` · p=0.75 · a three-arm switch returning display strings, asserted by restating the same three strings; the badge text has no edge cases and any deploy test that surfaces the message would catch a wrong arm
- `private/realworld/scope-b-sd/20-price-id-membership` · `trivial-primitive` · p=0.64 · isLocalPriceId is a one-line Set.has over the collection its sibling already tests, so the membership assertion adds nothing a checkout test touching a configured price would not show
- `private/realworld/scope-b/04-default-tab-membership` · `trivial-primitive` · p=0.61 · the block asserts that a constant declared from the same literal union is in that union, which the type system already guarantees and which no runtime change could break without the sibling fallback tests failing first
- `private/realworld/scope-b/06-discount-null-reason` · `trivial-primitive` · p=0.81 · the block isolates a single `?? ""` on an optional field, and a regression there would surface as the string "null" in the discount editor the moment anyone rendered it
- `private/realworld/scope-b/09-snapshot-url-builder` · `trivial-primitive` · p=0.68 · both blocks restate a template string and a URLSearchParams call, and the sibling cassette replay drives the same two builders end to end, so a wrong path or missing param fails there first
- `private/realworld/scope-b/13-reward-redeem-balance` · `happy-path-only-of-risky-boundary` · p=0.68 · the seeded ledger row is an ordinary credit the adjust route itself writes, so the fixture is reachable, but neither block drives the balance guards — a redemption that inserted the redemption row without the `total >= points_cost` filter, or an adjustment that drove the balance negative, would still pass
- `private/realworld/scope-b/20-congruence-always-ok` · `happy-path-only-of-risky-boundary` · p=0.42 · checkEndpointCongruence exists to return ok:false with missingHandlers, missingClaims, invalidPaths or duplicate normalized pairs, and all three blocks only ever assert ok:true, so a version that returned ok unconditionally — losing every incongruence report — would pass every one of them

## False positives (labelled not_fire, p at or above the check's own threshold)

- `dogfood/03-asks-for-the-test-class-as-a-choice-and` · `over-mocked` · p=0.64 · the assertions pin exact values the named behaviour produces; a plausible break changes them; the only fake is the model client, a vendor SDK at the external edge; the threshold filter, verbose band, diff gating, class mapping and cache are real analyze code, and the assertions pin exact finding arrays and the exact question set sent, not that a double was touched
- `dogfood/21-records-every-test-with-its-name-line-de` · `tests-internals` · p=0.67 · the assertions read the return value of extractTests (names, lines, describe paths, source slices, fileContext), which is the module's whole contract surface; nothing private is peeked
- `private/realworld/assertions-a-sd/17-streak-cleared-on-enforce` · `assertion-weaker-than-name` · p=0.82 · clearing the streak is a call into another module, so the call with the enforced org's id is the observable behaviour the name names, and it fails if the clear is skipped or passed the wrong org
- `private/realworld/assertions-a/01-legacy-overstay-zero` · `would-pass-if-broken` · p=0.74 · returning zero for every overstay is the whole behaviour the name claims, so reinstating any overage band for a full-day pass makes the second or third assertion fail

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

### `over-mocked`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.59 | 0.67 | no |
| collaborators-of-impl + first-party-vs-external-edge | 0.96 | 0.86 | no |
| baseline (realworld corpus) | 0.10 | 0.00 | no |
| provenance-of-asserted-value | 0.88 | 0.80 | yes |
| v2 no-fake-precondition + spy-args | 0.85 | 0.50 | no |

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

### `vacuous-assertion`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.18 | 0.20 | no |
| wrong-result procedure + look-alike no-list | 0.83 | 0.72 | yes |
| v1 + lone-not.toThrow / table-loop / distinguishing-substring clauses | 0.51 | 0.61 | no |
| v1 + sharpened table-loop clause | 0.81 | 0.61 | no |

### `impossible-fixture`

| variant | train F1 | holdout F1 | kept |
|---|---|---|---|
| baseline | 0.00 | 0.00 | no |
| name-the-violated-rule + writer-would-also-store negative | 0.59 | 0.86 | no |
| would-accept phrasing + guard-input carve-out | 0.00 | 0.00 | no |
| v1 + seed/hydrate bypass is how it gets in | 0.86 | 1.00 | yes |
| v3 + cast-reads-the-omitted-field yes | 0.86 | 1.00 | no |

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

716081 input tokens ≈ $0.0301 for the full corpus (783 cases, ~915 tokens per case) · model `jev-1.13.0`

Reproduce with `pnpm eval` (add `--offline` to re-score evals/results without calling the API).
