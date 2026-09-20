export type Check = {
  id: string;
  /** the glyph after the 😐 face for this check */
  emoji: string;
  /** the one-liner printed under a finding, in --list-checks and in the Claude skill */
  blurb: string;
  instructions: string;
  criteria?: { true: string; false: string };
  threshold: number;
  /** only sent when `diff` is part of the state */
  diffOnly?: true;
};

const T = 0.8;

export const CHECKS: Check[] = [
  {
    id: "would-pass-if-broken",
    emoji: "🚪",
    blurb: "The feature could leave the building. This test would wave.",
    instructions:
      "Would `test_code` still pass if the behavior its name (`test_name`, under `describe_path`) describes were broken in an obvious way in `implementation`?",
    criteria: {
      true: "An obvious break of the named behavior would leave every assertion in the test satisfied.",
      false: "At least one assertion fails once the named behavior is broken.",
    },
    threshold: T,
  },
  {
    id: "vacuous-assertion",
    emoji: "🤏",
    blurb: "This assertion proves this much.",
    instructions:
      "Are the assertions in `test_code` ones that almost any outcome satisfies — toBeDefined, toBeTruthy, length >= 0, not.toThrow with nothing else asserted, status !== 500, or 'greater than some older value'?",
    criteria: {
      true: "The assertions accept a wide range of wrong outputs as well as the right one.",
      false: "The assertions pin an exact value, shape or error that a plausible bug would violate.",
    },
    threshold: T,
  },
  {
    id: "assertion-weaker-than-name",
    emoji: "💅",
    blurb: "Technically passes. The name wrote a cheque the assertion doesn't cash.",
    instructions:
      "Is what `test_code` actually asserts materially weaker than the behavior `test_name` promises?",
    criteria: {
      true: "The name promises a behavior the assertions do not check.",
      false: "The assertions cover the behavior the name promises.",
    },
    threshold: T,
  },
  {
    id: "reimplements-logic",
    emoji: "🤝",
    blurb: "Test and implementation, shaking hands on the same bug.",
    instructions:
      "Does `test_code` compute its expected value by re-doing the algorithm under test (so test and `implementation` would share the same mistake), instead of using a fixed, requirement-derived example?",
    criteria: {
      true: "The expected value is derived by repeating the production computation in the test.",
      false: "Expected values are literals or fixtures derived from the requirement.",
    },
    threshold: T,
  },
  {
    id: "mocks-seam-under-test",
    emoji: "👏",
    blurb: "Congratulations. You tested the mock.",
    instructions:
      "Does `test_code` (with `file_context`) mock or stub the exact collaborator whose integration with the code under test is the thing being tested — both sides of a write/read, producer/consumer, authorization, persistence, cache-key, queue, signature or serialization boundary faked so they agree by construction?",
    criteria: {
      true: "The boundary the test claims to verify is replaced by fakes preconfigured to agree.",
      false: "Only true external edges are faked; the boundary under test runs for real.",
    },
    threshold: T,
  },
  {
    id: "mock-mirrors-implementation",
    emoji: "🪞",
    blurb: "The mock is the implementation in a wig.",
    instructions:
      "Does the mock setup in `test_code` or `file_context` duplicate `implementation` so closely that the test proves almost nothing about the real code?",
    threshold: T,
  },
  {
    id: "tests-calls-not-outcomes",
    emoji: "🙏",
    blurb: "It was called. Please, one assertion about what happened next.",
    instructions:
      "Does `test_code` assert only that something was called (toHaveBeenCalled, call counts) without meaningful arguments or resulting observable state, in a case where making the call is not itself the public contract?",
    criteria: {
      true: "The only evidence is that a call happened; arguments and resulting state go unchecked.",
      false: "Meaningful arguments or observable results are asserted, or the call itself is the contract.",
    },
    threshold: T,
  },
  {
    id: "tests-internals",
    emoji: "🧠",
    blurb: "Tests how it's built, not what it does. A rename will kill it.",
    instructions:
      "Does `test_code` test framework or component internals and implementation details — React state, private methods, CSS class names, source text, statement order — instead of user-visible or externally observable behavior?",
    threshold: T,
  },
  {
    id: "setup-dominates",
    emoji: "🌀",
    blurb: "The setup has become the application.",
    instructions:
      "Is most of the setup in `test_code` and `file_context` unrelated to the behavior under test, so that the actual assertion is hard to find?",
    threshold: T,
  },
  {
    id: "broad-snapshot",
    emoji: "📸",
    blurb: "Snapshot crime. Nobody will read it, everybody will update it.",
    instructions:
      "Does `test_code` rely on a snapshot so broad that a reviewer cannot tell which behavior it protects, and would likely re-record it rather than investigate a diff?",
    threshold: T,
  },
  {
    id: "swallowed-error-as-success",
    emoji: "🔥",
    blurb: "Green. Production on fire.",
    instructions:
      "Does `test_code` pass when an unexpected error is swallowed, logged or answered with a fallback, or use try/catch in a way that also passes when nothing throws at all?",
    criteria: {
      true: "An unexpected failure inside the code under test would still leave this test green.",
      false: "The required error type or result is asserted, and a missing throw fails the test.",
    },
    threshold: T,
  },
  {
    id: "impossible-fixture",
    emoji: "🎭",
    blurb: "A state production can never reach. Confidence, but fake.",
    instructions:
      "Do the fixtures in `test_code` use `as Type`, partial objects or direct persistence writes to build state that production validation, constructors or database constraints could never create — where the test is not explicitly about corrupt legacy data?",
    criteria: {
      true: "The fixture bypasses a real validation boundary that matters to the behavior under test.",
      false: "Fixtures go through real construction/validation, or the test is deliberately about corrupt data.",
    },
    threshold: T,
  },
  {
    id: "happy-path-only-of-risky-boundary",
    emoji: "🙌",
    blurb: "Wow, green CI. The refusal path that pages you is untested.",
    instructions:
      "Is `test_code` a cosmetic happy-path permutation of a path whose real risk is a refusal or failure case — permissions, tenant isolation, duplicates, retries, concurrency, partial failure — that nothing in `sibling_tests` covers either?",
    criteria: {
      true: "The risky refusal/failure case is untested here and absent from `sibling_tests`.",
      false: "The risky case is covered by this test or by a sibling test.",
    },
    threshold: T,
  },
  {
    id: "trivial-primitive",
    emoji: "🔬",
    blurb: "Tests a one-line helper in isolation. Any real test of the feature covers this for free.",
    instructions:
      "Is the code under test in `test_code` and `implementation` a small pure primitive — a formatter, getter, trivial mapper, constant lookup or thin wrapper — whose bugs would be obvious in any wider test of the feature that uses it?",
    criteria: {
      true: "A one-liner with no subtle edge cases, already exercised by any real test of the feature.",
      false: "The behavior has edge cases worth pinning on their own — money or rounding, parsing, dates and time zones, encoding, or a security or permission path.",
    },
    threshold: T,
  },
  {
    id: "over-mocked",
    emoji: "🧱",
    blurb: "Mocks all the way down. Nothing real is left to fail.",
    instructions:
      "Does `test_code` with `file_context` mock or stub so many collaborators that the only real code left running is glue, so a wiring or contract bug between the real components could not be observed?",
    criteria: {
      true: "Every collaborator is faked; nothing but the function name under test is real.",
      false: "Enough real code runs that a wiring or contract mistake would fail the test.",
    },
    threshold: T,
  },
  {
    id: "regression-does-not-distinguish",
    emoji: "💀",
    blurb: "The bug passes this regression test too.",
    instructions:
      "Given `diff`, does this regression test fail to distinguish the pre-fix implementation from the fixed one — would it have passed before the fix?",
    criteria: {
      true: "The test passes against both the buggy and the fixed implementation.",
      false: "The test fails against the pre-fix implementation and passes after the fix.",
    },
    threshold: T,
    diffOnly: true,
  },
  {
    id: "changed-in-lockstep",
    emoji: "🧑‍🍳",
    blurb: "Test and implementation changed together. Cooked.",
    instructions:
      "In `diff`, were the implementation and the test changed in the same way, so the test may simply mirror the new behavior (including a bug) rather than check a requirement?",
    criteria: {
      true: "The test's expectations were edited to match the new implementation output.",
      false: "The test expresses a requirement that was decided independently of the implementation change.",
    },
    threshold: T,
    diffOnly: true,
  },];

/** Not a finding — what kind of test this is. lgtm likes `contract_integration`. */
export const TEST_CLASSES = {
  pure_logic: "A function maps inputs to outputs, with no collaborators involved.",
  mocked_seam_unit: "One component is exercised with its neighbours faked.",
  contract_integration: "Two or more real components run together and the assertion checks that they agree.",
} as const;

export type TestClass = keyof typeof TEST_CLASSES;

export const CLASS_EMOJI: Record<TestClass, string> = {
  contract_integration: "🎯",
  mocked_seam_unit: "🧱",
  pure_logic: "🔬",
};
