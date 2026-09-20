import type { Check } from "../types.js";

export default {
  id: "assertion-weaker-than-name",
  emoji: "💅",
  blurb: "The name promises a behaviour the assertions never check.",
  instructions:
    "Is what `test_code` actually asserts materially weaker than the behavior `test_name` promises?",
  criteria: {
    true: "The name promises a behavior the assertions do not check.",
    false: "The assertions cover the behavior the name promises.",
  },
  threshold: 0.60,
} satisfies Check;
