import type { Check } from "../types.js";

export default {
  id: "trivial-primitive",
  blurb: "A one-line helper tested on its own; any real test of the feature that uses it would catch the same break. Delete it, or test the feature.",
  instructions:
    "Is the code under test in `test_code` and `implementation` a small pure primitive — a formatter, getter, trivial mapper, constant lookup or thin wrapper — whose bugs would be obvious in any wider test of the feature that uses it?",
  criteria: {
    true: "A one-liner with no subtle edge cases, already exercised by any real test of the feature.",
    false: "The behavior has edge cases worth pinning on their own — money or rounding, parsing, dates and time zones, encoding, or a security or permission path.",
  },
  // Pinned under the fitted 0.90: the real positives run from 0.7 up and the real negatives top out under 0.6.
  threshold: 0.68,
  high: 0.78,
  pinned: true,
} satisfies Check;
