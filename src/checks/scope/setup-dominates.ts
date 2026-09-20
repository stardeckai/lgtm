import type { Check } from "../types.js";

export default {
  id: "setup-dominates",
  blurb: "Most of the setup never reaches the assertion. It is scenery.",
  instructions:
    "Charge to this block only what it constructs itself, plus file-level mocks, fixtures and `beforeEach` values that no block in `sibling_tests` reads (a single-block file owns all of them). A module-mock wall or fixture the siblings share is the suite's scaffolding, not this block's scenery. If the charged setup is under about five lines, answer no. Otherwise trace the exercised path in `implementation`: a fixture, field or stub is load-bearing when the code reads or branches on it so the asserted value depends on it, even if no assertion names it. Answer yes only when most of the charged setup is inert — records, collaborators and fields the path never touches, however the types demand them.",
  criteria: {
    true: "This block builds its own bulky fixture and most of its fields, rows or stubs are never touched by the exercised path.",
    false:
      "The bulky mocks or fixtures are file-level and shared with sibling blocks, or the path reads what is built, or the block owns only a few lines of setup.",
  },
  threshold: 0.60,
} satisfies Check;
