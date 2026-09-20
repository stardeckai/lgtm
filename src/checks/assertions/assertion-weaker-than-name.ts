import type { Check } from "../types.js";

export default {
  id: "assertion-weaker-than-name",
  blurb: "The name promises a behaviour the assertions never check; assert it, or rename the test to what it proves.",
  instructions:
    "Is what `test_code` actually asserts materially weaker than the behavior `test_name` promises?",
  criteria: {
    true: "The name promises a behavior the assertions do not check.",
    false: "The assertions cover the behavior the name promises.",
  },
  // Pinned under the fitted 0.90, which one real negative at 0.82 forced; the real positives run from 0.65 up.
  threshold: 0.68,
  high: 0.78,
  pinned: true,
} satisfies Check;
