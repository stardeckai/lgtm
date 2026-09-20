---
name: lgtm
description: Run the lgtm test linter on the current branch or a path and act on its findings. Use when the user runs /lgtm, asks whether tests are any good, or asks which tests to delete or strengthen.
---

# lgtm

First run `lgtm --diff` (bare: it scopes to the tests you changed, the tests you added, and the tests of
implementation you changed, against the default branch), or `lgtm <path>` when the user named a path, without
`--yes`: in a non-interactive shell it only prints the plan — files, estimated cost and runtime — and exits. Tell
the user the estimate in one line. Then run the same command again with `--yes --format json` to actually analyse
(for example `lgtm --diff --yes --format json`). The two diff-only checks are asked only about blocks your change
touched, so an old test in a file you edited is never reported as a weak regression test.

`lgtm` is usually installed globally; in a repo that depends on it, run `pnpm lgtm` / `npx lgtm` instead.
If neither works, do not work around it — tell the user to run `npm i -g @stardeckai/lgtm && lgtm init` and stop there.

For each finding: read the test, then decide **keep**, **delete** or **replace**.

- Keep it only if you can complete "this test prevents us from shipping [specific incorrect behavior]".
- Delete it when the behavior it claims to protect is already covered, or when nothing plausible would break it.
- Replace it when the behavior matters but the test does not check it. A replacement counts only once you
  have shown it fail on the plausible bug — mutate or revert the behavior, watch it go red for the right
  reason, then restore.
- Never mock the seam under test. If both sides of a boundary are faked to agree, the test proves nothing.
- Prefer one wider test with real collaborators that retires several unit tests over patching each unit
  test in place. A good audit improves the suite while reducing the test count.

Report as a table: file:line, check id, verdict, one-line reason.

## Reading the output

Each finding line opens with one of four faces, one per family: `😐🤏` the assertion proves this much,
`😐👏` you tested the mock, `😐🤌` what exactly are we doing here, `😐🫸` do not merge this. Then the
check id and a one-line reason (`--verbose` adds the probability, which is a score against a fitted cut-off, not a confidence); `--format json` adds a `checks` map with the longer explanation
and the fix, once per check. A finding within 0.15 of its check's threshold is shown as `😐🤞` with "Worth a
look." and is not counted against the test; one clear of that margin is red and counts. `--verbose` suspects
under the threshold show a bare `😐`. The verdict is one line: `😐👍  N tests. fine...lgtm?`,
`😐🤞  N tests worth a look. nothing proven, nothing disproven.` or `😐🫵  N tests prove nothing.` The class line
counts contract-integration (the good kind), mocked-seam and pure-logic.

## Checks

- 😐🤏 `would-pass-if-broken` — Remove the behaviour in the name and every assertion stays green: the fixture never reaches that branch. Move it to the failing side.
  The fixture sits on the safe side of the branch the test name promises, so deleting that branch leaves every assertion green. Move the fixture to the failing side (the wrong tenant, the expired token, the second caller) and assert the refusal.
- 😐🤏 `vacuous-assertion` — The assertion (toBeDefined, truthy, length ≥ 0) accepts wrong output too; pin the exact value a bug would change.
  Assertions like toBeDefined, toBeTruthy, length >= 0 or status !== 500 accept most wrong outputs as well as the right one. Pin the exact value, shape or error that a plausible bug would change.
- 😐🤏 `assertion-weaker-than-name` — The name promises a behaviour the assertions never check; assert it, or rename the test to what it proves.
  The name promises a behaviour the assertions never check, so the test documents coverage that does not exist. Either assert what the name says or rename the test to what it actually proves.
- 😐👏 `reimplements-logic` — The expected value is computed with the same logic as production, so both can be wrong together; write the expected value by hand.
  The expected value is computed with the same algorithm as production, so both sides share the same mistake and the test can only fail on a typo. Use a fixed literal or a requirement-derived example that was worked out independently.
- 😐👏 `mocks-seam-under-test` — The collaborator that decides this behaviour is a mock, so the test proves the mock's script, not the code; use the real one here.
  The collaborator that decides the behaviour under test is itself the scripted mock, so the test asserts what the mock was told, not what the code does. Keep that collaborator real (in-memory is fine) and fake only true external edges.
- 😐👏 `mock-mirrors-implementation` — The mock re-encodes the production logic, so an implementation that agrees with the copy passes even when both are wrong; use the real collaborator or fixed data.
  The mock's body re-encodes the production logic, so the test passes for any implementation that agrees with the copy, including a wrong one. Replace the scripted logic with fixed return values chosen from requirements.
- 😐🤏 `tests-calls-not-outcomes` — It checks that a function was called, not what the call changed; assert the resulting state or output.
  toHaveBeenCalled and call counts prove a function ran, not that anything correct happened. Assert the arguments that matter and the resulting state, unless the call itself is the public contract (an outbound webhook payload, a notification).
- 😐🤌 `tests-internals` — It asserts private state, class names or call order rather than observable behaviour, so a refactor breaks it and a bug does not; assert the output.
  The assertion reads private state, class names, render counts or source text, so a harmless refactor breaks it while a real bug can pass. Assert the contract surface: return values, rendered text and roles, persisted state, emitted payloads.
- 😐🤌 `setup-dominates` — Most of the setup never reaches the assertion; cut it to what the assertion depends on, or assert more of it.
  Most of the fixtures and mocks never reach the asserted value; they make the test look thorough and hide which inputs actually matter. Delete inert setup until every constructed object is read by the exercised path or named in an assertion.
- 😐🤏 `broad-snapshot` — The assertion is a snapshot of the whole output, so any change re-records it and nobody reads what changed; pin the fields that matter.
  A snapshot of a whole object or tree pins everything and explains nothing, so reviewers update it blindly on the next change. Snapshot only the field the test is about, or replace it with focused assertions.
- 😐🤏 `swallowed-error-as-success` — The test passes whether the error is thrown, caught or never raised; assert the specific failure by class, code or message.
  The test stays green when an unexpected error is caught, logged or turned into a fallback, and even when nothing throws at all. Use await expect(...).rejects.toThrow(SpecificError) or expect.assertions(n), and assert the specific failure, not any failure.
- 😐🤌 `impossible-fixture` — The fixture is a state production validation could never produce, so the branch it exercises cannot happen; build it through the real constructor or validator.
  The fixture (an as-cast, a partial object, a direct write) creates a state production validation could never produce, so the test exercises a world that does not exist. Build fixtures through the real constructor, parser or API.
- 😐🤌 `happy-path-only-of-risky-boundary` — The refusal path this code exists for (the reject, the limit, the wrong tenant) has no test here or among its siblings; add one.
  The implementation exists to refuse something (a duplicate, a stale version, a cross-tenant read, an over-refund) and neither this test nor any sibling drives that refusal. Write the refusal test; it is the one that would have paged you.
- 😐🤌 `trivial-primitive` — A one-line helper tested on its own; any real test of the feature that uses it would catch the same break. Delete it, or test the feature.
  The unit under test is a one-line getter, mapper or forwarding wrapper whose failure any wider test of the feature would expose. Delete the test and let the feature test cover it; keep it only when the primitive has real edge cases (money, dates, parsing, permissions).
- 😐👏 `over-mocked` — Every asserted value came out of a fake; the only real code left is glue between stubs. Fake fewer collaborators, or test the integration.
  So many first-party collaborators are faked that the remaining real code is glue over stub returns, so no contract between components can fail. Run the real components together and fake only clocks, randomness, network, third-party gateways and the file system.
- 😐🫸 `regression-does-not-distinguish` — This regression test also passes on the pre-fix code, so it does not lock the fix; assert the value the bug got wrong.
  This regression test also passes against the pre-fix implementation, so it does not lock the bug. Make it fail on the old code first: pick the input that triggered the bug, assert the corrected output.
- 😐🫸 `changed-in-lockstep` — The expected values changed in the same diff as the code that produces them, so the test may only mirror the new behaviour; derive them from the requirement.
  The implementation and the test's expected literals changed together in the same diff, so the test tracks the new behaviour whether or not it is right. Re-derive the expected value from the requirement and check it was not simply copied from the new output.
