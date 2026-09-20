import type { Check } from "../types.js";

export default {
  id: "impossible-fixture",
  emoji: "🎭",
  blurb: "The fixture builds a state production validation could never produce.",
  instructions:
    "Do the fixtures in `test_code` use `as Type`, partial objects or direct persistence writes to build state that production validation, constructors or database constraints could never create — where the test is not explicitly about corrupt legacy data?",
  criteria: {
    true: "The fixture bypasses a real validation boundary that matters to the behavior under test.",
    false: "Fixtures go through real construction/validation, or the test is deliberately about corrupt data.",
  },
  threshold: 0.65,
} satisfies Check;
