import type { Check } from "../types.js";

export default {
  id: "regression-does-not-distinguish",
  blurb: "This regression test also passes on the pre-fix code, so it does not lock the fix; assert the value the bug got wrong.",
  instructions:
    "Procedure. 1. In `diff`, find the code this test exercises. All additions — a new function, file or export with no removed (`-`) line — means the behaviour is new rather than fixed: answer no. 2. Otherwise name the input whose result the change altered: the value that takes the new branch, trips the added guard, or hits the edited constant or mapping entry. 3. Search `test_code` for that input. If it is absent, or appears only where the old and new code agree, the test never sees the fix: answer yes. 4. Answer no only when an assertion feeds that input and pins the changed output.",
  criteria: {
    true: "Every assertion in this test also holds against the pre-change code in `diff`.",
    false: "An assertion fails against the pre-change code, or `diff` only adds code that did not exist before.",
  },
  threshold: 0.35,
  diffOnly: true,
  // Off by default (Sept 2026): the corpus has no real case for the diff checks, so the threshold is fitted on
  // synthetic ones only. On a 584-test customer branch this family was 102 of 187 flagged findings and 42 of 54
  // high-confidence ones, with a median score at the threshold. Back on after a PR-based harvest (see TODO.md).
  optIn: true,
} satisfies Check;
