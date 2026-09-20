import type { Check } from "../types.js";

export default {
  id: "reimplements-logic",
  emoji: "🤝",
  blurb: "Test and implementation, shaking hands on the same bug.",
  instructions:
    "Does `test_code` compute its expected value by re-doing the algorithm under test (so test and `implementation` would share the same mistake), instead of using a fixed, requirement-derived example?",
  criteria: {
    true: "The expected value is derived by repeating the production computation in the test.",
    false: "Expected values are literals or fixtures derived from the requirement.",
  },
  threshold: 0.75,
} satisfies Check;
