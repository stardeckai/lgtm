import type { Check } from "../types.js";

export default {
  id: "regression-does-not-distinguish",
  emoji: "💀",
  blurb: "The bug passes this regression test too.",
  instructions:
    "Given `diff`, does this regression test fail to distinguish the pre-fix implementation from the fixed one — would it have passed before the fix?",
  criteria: {
    true: "The test passes against both the buggy and the fixed implementation.",
    false: "The test fails against the pre-fix implementation and passes after the fix.",
  },
  threshold: 0.45,
  diffOnly: true,
} satisfies Check;
