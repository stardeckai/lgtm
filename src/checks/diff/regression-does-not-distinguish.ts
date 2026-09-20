import type { Check } from "../types.js";

export default {
  id: "regression-does-not-distinguish",
  blurb: "This regression test also passes on the buggy code, so it does not lock the fix.",
  instructions:
    "Procedure. 1. In `diff`, find the code this test exercises. All additions — a new function, file or export with no removed (`-`) line — means the behaviour is new rather than fixed: answer no. 2. Otherwise name the input whose result the change altered: the value that takes the new branch, trips the added guard, or hits the edited constant or mapping entry. 3. Search `test_code` for that input. If it is absent, or appears only where the old and new code agree, the test never sees the fix: answer yes. 4. Answer no only when an assertion feeds that input and pins the changed output.",
  criteria: {
    true: "Every assertion in this test also holds against the pre-change code in `diff`.",
    false: "An assertion fails against the pre-change code, or `diff` only adds code that did not exist before.",
  },
  threshold: 0.35,
  diffOnly: true,
} satisfies Check;
