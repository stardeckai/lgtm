import { DEFAULT_THRESHOLD, type Check } from "../types.js";

export default {
  id: "trivial-primitive",
  emoji: "🔬",
  blurb: "A one-line helper tested in isolation; any real test of the feature that uses it would catch the same break.",
  instructions:
    "Is the code under test in `test_code` and `implementation` a small pure primitive — a formatter, getter, trivial mapper, constant lookup or thin wrapper — whose bugs would be obvious in any wider test of the feature that uses it?",
  criteria: {
    true: "A one-liner with no subtle edge cases, already exercised by any real test of the feature.",
    false: "The behavior has edge cases worth pinning on their own — money or rounding, parsing, dates and time zones, encoding, or a security or permission path.",
  },
  threshold: DEFAULT_THRESHOLD,
} satisfies Check;
