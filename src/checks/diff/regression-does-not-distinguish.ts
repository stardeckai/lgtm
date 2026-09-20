import type { Check } from "../types.js";

export default {
  id: "regression-does-not-distinguish",
  emoji: "💀",
  blurb: "This regression test also passes on the buggy code, so it does not lock the fix.",
  instructions:
    "Given `diff`, does this regression test fail to distinguish the pre-fix implementation from the fixed one — would it have passed before the fix?",
  criteria: {
    true: "The test passes against both the buggy and the fixed implementation.",
    false: "The test fails against the pre-fix implementation and passes after the fix.",
  },
  threshold: 0.35,
  diffOnly: true,
} satisfies Check;
