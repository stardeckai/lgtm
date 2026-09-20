import type { Check } from "../types.js";

export default {
  id: "mock-mirrors-implementation",
  blurb: "The mock re-encodes the production logic; any implementation that agrees with the copy passes.",
  instructions:
    "Does the mock setup in `test_code` or `file_context` duplicate `implementation` so closely that the test proves almost nothing about the real code?",
  threshold: 0.60,
} satisfies Check;
