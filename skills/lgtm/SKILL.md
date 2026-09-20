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
check id, its probability and a one-line reason; `--format json` adds a `checks` map with the longer explanation
and the fix, once per check. Colour is severity (red ≥ 0.9, yellow at or over the check's threshold, dim for
`--verbose` suspects shown with a bare `😐`). The verdict is one line: `😐👍  N tests. fine. allegedly.` or
`😐🫵  N tests prove nothing.` The class line counts contract-integration (the good kind), mocked-seam and pure-logic.

## Checks

- 😐🤏 `would-pass-if-broken` — Break the behaviour the name describes and this test still passes; the fixture never reaches it.
  The fixture sits on the safe side of the branch the test name promises, so deleting that branch leaves every assertion green. Move the fixture to the failing side (the wrong tenant, the expired token, the second caller) and assert the refusal.
- 😐🤏 `vacuous-assertion` — The assertion accepts almost any output, so it cannot fail for a real bug.
  Assertions like toBeDefined, toBeTruthy, length >= 0 or status !== 500 accept most wrong outputs as well as the right one. Pin the exact value, shape or error that a plausible bug would change.
- 😐🤏 `assertion-weaker-than-name` — The name promises a behaviour the assertions never check.
  The name promises a behaviour the assertions never check, so the test documents coverage that does not exist. Either assert what the name says or rename the test to what it actually proves.
- 😐👏 `reimplements-logic` — The expected value is computed with the same logic as production, so both can be wrong together.
  The expected value is computed with the same algorithm as production, so both sides share the same mistake and the test can only fail on a typo. Use a fixed literal or a requirement-derived example that was worked out independently.
- 😐👏 `mocks-seam-under-test` — The collaborator that decides this behaviour is a mock, so the test only proves the mock works.
  The collaborator that decides the behaviour under test is itself the scripted mock, so the test asserts what the mock was told, not what the code does. Keep that collaborator real (in-memory is fine) and fake only true external edges.
- 😐👏 `mock-mirrors-implementation` — The mock re-encodes the production logic; any implementation that agrees with the copy passes.
  The mock's body re-encodes the production logic, so the test passes for any implementation that agrees with the copy, including a wrong one. Replace the scripted logic with fixed return values chosen from requirements.
- 😐🤏 `tests-calls-not-outcomes` — It asserts that a function was called, not what happened as a result.
  toHaveBeenCalled and call counts prove a function ran, not that anything correct happened. Assert the arguments that matter and the resulting state, unless the call itself is the public contract (an outbound webhook payload, a notification).
- 😐🤌 `tests-internals` — It asserts private state, class names or call order instead of observable behaviour; a refactor breaks it, a bug does not.
  The assertion reads private state, class names, render counts or source text, so a harmless refactor breaks it while a real bug can pass. Assert the contract surface: return values, rendered text and roles, persisted state, emitted payloads.
- 😐🤌 `setup-dominates` — Most of the setup never reaches the assertion. It is scenery.
  Most of the fixtures and mocks never reach the asserted value; they make the test look thorough and hide which inputs actually matter. Delete inert setup until every constructed object is read by the exercised path or named in an assertion.
- 😐🤏 `broad-snapshot` — The snapshot pins everything and explains nothing, so it will be re-recorded on the next change.
  A snapshot of a whole object or tree pins everything and explains nothing, so reviewers update it blindly on the next change. Snapshot only the field the test is about, or replace it with focused assertions.
- 😐🤏 `swallowed-error-as-success` — The test stays green whether the error is caught, logged, or never thrown; it never pins the specific failure.
  The test stays green when an unexpected error is caught, logged or turned into a fallback, and even when nothing throws at all. Use await expect(...).rejects.toThrow(SpecificError) or expect.assertions(n), and assert the specific failure, not any failure.
- 😐🤌 `impossible-fixture` — The fixture builds a state production validation could never produce.
  The fixture (an as-cast, a partial object, a direct write) creates a state production validation could never produce, so the test exercises a world that does not exist. Build fixtures through the real constructor, parser or API.
- 😐🤌 `happy-path-only-of-risky-boundary` — The refusal path this code exists for, the one that pages you, has no test here or among its siblings.
  The implementation exists to refuse something (a duplicate, a stale version, a cross-tenant read, an over-refund) and neither this test nor any sibling drives that refusal. Write the refusal test; it is the one that would have paged you.
- 😐🤌 `trivial-primitive` — A one-line helper tested in isolation; any real test of the feature that uses it would catch the same break.
  The unit under test is a one-line getter, mapper or forwarding wrapper whose failure any wider test of the feature would expose. Delete the test and let the feature test cover it; keep it only when the primitive has real edge cases (money, dates, parsing, permissions).
- 😐👏 `over-mocked` — So many collaborators are faked that only glue is left to fail.
  So many first-party collaborators are faked that the remaining real code is glue over stub returns, so no contract between components can fail. Run the real components together and fake only clocks, randomness, network, third-party gateways and the file system.
- 😐🫸 `regression-does-not-distinguish` — This regression test also passes on the buggy code, so it does not lock the fix.
  This regression test also passes against the pre-fix implementation, so it does not lock the bug. Make it fail on the old code first: pick the input that triggered the bug, assert the corrected output.
- 😐🫸 `changed-in-lockstep` — Implementation and expected values changed together, so the test may only mirror the new behaviour.
  The implementation and the test's expected literals changed together in the same diff, so the test tracks the new behaviour whether or not it is right. Re-derive the expected value from the requirement and check it was not simply copied from the new output.
