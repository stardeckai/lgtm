import type { Check } from "../types.js";

export default {
  id: "regression-does-not-distinguish",
  blurb: "This regression test also passes on the pre-fix code, so it does not lock the fix; assert the value the bug got wrong.",
  instructions:
    "Procedure. 1. In `diff`, find the code this test exercises. All additions — a new function, file or export with no removed (`-`) line — means the behaviour is new rather than fixed: answer no. 2. Run this test's fixture through the pre-change code (the `-` side) in your head and write down what it returns, throws or renders, then do the same for the post-change code. 3. Compare the pre-change output with every assertion. If any assertion rejects it — a renamed or missing field read by the test, an extra defined key that toEqual refuses, a different value, status, type or error — the test catches the old code: answer no. 4. If the two outputs are identical on this fixture, ask whether the diff changes what any caller could observe: an altered branch, guard, constant, mapping entry or default that some other input would hit. If it does, this test never sends that input and sees no fix: answer yes. Two shapes of that are easy to miss: the test now passes explicitly the very value a removed default used to supply, so the old code with its default and the new code with the argument agree; and the test edit only added a now-required argument or a comment while the assertions stayed byte-identical. If the diff only renames identifiers, reorders or reformats code, rewrites comments or messages the test never asserts, or drops fields no input in the test supplies, there is no fix for a test to lock: answer no.",
  criteria: {
    true: "The pre-change code produces the same asserted output on this fixture, and the diff changes behaviour for some input this test never sends.",
    false: "An assertion fails against the pre-change code, or the diff only adds code or changes nothing a test could observe.",
  },
  threshold: 0.75,
  diffOnly: true,
  // Off by default (Sept 2026): the corpus has no real case for the diff checks, so the threshold is fitted on
  // synthetic ones only. On a 584-test customer branch this family was 102 of 187 flagged findings and 42 of 54
  // high-confidence ones, with a median score at the threshold. Back on after a PR-based harvest (see TODO.md).
  optIn: true,
} satisfies Check;
