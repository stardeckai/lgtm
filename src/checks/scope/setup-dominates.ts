import type { Check } from "../types.js";

export default {
  id: "setup-dominates",
  emoji: "🌀",
  blurb: "Most of the setup never reaches the assertion. It is scenery.",
  instructions:
    "Inventory everything `test_code` and `file_context` construct: `vi.mock` calls, top-level consts, fixture objects and their fields, inserted records. Then trace the asserted call through `implementation`: which of those does the exercised path actually read, so that changing it would change the asserted value? Is most of that setup inert — deletable without touching the assertion?",
  criteria: {
    true: "Most mocks, fixtures or fields never reach the asserted value; they exist to make the test look realistic.",
    false:
      "Every fixture and mock is read by the exercised path or named in an assertion — or the setup is only a few lines, whatever else is wrong with the test.",
  },
  threshold: 0.95,
} satisfies Check;
