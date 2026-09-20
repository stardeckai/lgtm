/**
 * One explanation per check: why the smell matters and what to do instead. Emitted once in `--format json`
 * (under `checks`) and in the generated skill, so a finding only needs to carry the check id.
 * Kept apart from the check files so wording tuned by the evals and prose for humans change independently.
 */
export const EXPLANATIONS: Record<string, string> = {
  "would-pass-if-broken":
    "The fixture sits on the safe side of the branch the test name promises, so deleting that branch leaves every assertion green. Move the fixture to the failing side (the wrong tenant, the expired token, the second caller) and assert the refusal.",
  "vacuous-assertion":
    "Assertions like toBeDefined, toBeTruthy, length >= 0 or status !== 500 accept most wrong outputs as well as the right one. Pin the exact value, shape or error that a plausible bug would change.",
  "assertion-weaker-than-name":
    "The name promises a behaviour the assertions never check, so the test documents coverage that does not exist. Either assert what the name says or rename the test to what it actually proves.",
  "reimplements-logic":
    "The expected value is computed with the same algorithm as production, so both sides share the same mistake and the test can only fail on a typo. Use a fixed literal or a requirement-derived example that was worked out independently.",
  "mocks-seam-under-test":
    "The collaborator that decides the behaviour under test is itself the scripted mock, so the test asserts what the mock was told, not what the code does. Keep that collaborator real (in-memory is fine) and fake only true external edges.",
  "mock-mirrors-implementation":
    "The mock's body re-encodes the production logic, so the test passes for any implementation that agrees with the copy, including a wrong one. Replace the scripted logic with fixed return values chosen from requirements.",
  "tests-calls-not-outcomes":
    "toHaveBeenCalled and call counts prove a function ran, not that anything correct happened. Assert the arguments that matter and the resulting state, unless the call itself is the public contract (an outbound webhook payload, a notification).",
  "tests-internals":
    "The assertion reads private state, class names, render counts or source text, so a harmless refactor breaks it while a real bug can pass. Assert the contract surface: return values, rendered text and roles, persisted state, emitted payloads.",
  "setup-dominates":
    "Most of the fixtures and mocks never reach the asserted value; they make the test look thorough and hide which inputs actually matter. Delete inert setup until every constructed object is read by the exercised path or named in an assertion.",
  "broad-snapshot":
    "A snapshot of a whole object or tree pins everything and explains nothing, so reviewers update it blindly on the next change. Snapshot only the field the test is about, or replace it with focused assertions.",
  "swallowed-error-as-success":
    "The test stays green when an unexpected error is caught, logged or turned into a fallback, and even when nothing throws at all. Use await expect(...).rejects.toThrow(SpecificError) or expect.assertions(n), and assert the specific failure, not any failure.",
  "impossible-fixture":
    "The fixture (an as-cast, a partial object, a direct write) creates a state production validation could never produce, so the test exercises a world that does not exist. Build fixtures through the real constructor, parser or API.",
  "happy-path-only-of-risky-boundary":
    "The implementation exists to refuse something (a duplicate, a stale version, a cross-tenant read, an over-refund) and neither this test nor any sibling drives that refusal. Write the refusal test; it is the one that would have paged you.",
  "trivial-primitive":
    "The unit under test is a one-line getter, mapper or forwarding wrapper whose failure any wider test of the feature would expose. Delete the test and let the feature test cover it; keep it only when the primitive has real edge cases (money, dates, parsing, permissions).",
  "over-mocked":
    "So many first-party collaborators are faked that the remaining real code is glue over stub returns, so no contract between components can fail. Run the real components together and fake only clocks, randomness, network, third-party gateways and the file system.",
  "regression-does-not-distinguish":
    "This regression test also passes against the pre-fix implementation, so it does not lock the bug. Make it fail on the old code first: pick the input that triggered the bug, assert the corrected output.",
  "changed-in-lockstep":
    "The implementation and the test's expected literals changed together in the same diff, so the test tracks the new behaviour whether or not it is right. Re-derive the expected value from the requirement and check it was not simply copied from the new output.",
};
