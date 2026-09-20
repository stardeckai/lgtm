import type { Check } from "../types.js";

export default {
  id: "mock-mirrors-implementation",
  blurb: "The mock re-encodes the production logic, so an implementation that agrees with the copy passes even when both are wrong; use the real collaborator or fixed data.",
  instructions:
    "Does the mock setup in `test_code` or `file_context` duplicate `implementation` so closely that the test proves almost nothing about the real code?",
  threshold: 0.55,
} satisfies Check;
