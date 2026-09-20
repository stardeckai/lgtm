import type { Check } from "../types.js";

export default {
  id: "mock-mirrors-implementation",
  emoji: "🪞",
  blurb: "The mock is the implementation in a wig.",
  instructions:
    "Does the mock setup in `test_code` or `file_context` duplicate `implementation` so closely that the test proves almost nothing about the real code?",
  threshold: 0.50,
} satisfies Check;
