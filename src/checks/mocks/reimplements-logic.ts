import type { Check } from "../types.js";

export default {
  id: "reimplements-logic",
  blurb: "The expected value is computed with the same logic as production, so both can be wrong together.",
  instructions:
    "Does `test_code` reproduce the algorithm under test — the same formula, loop, or production helper `implementation` uses — to construct what it asserts (the expected value, or an input engineered to satisfy it), so test and implementation would share the same mistake instead of a fixed, requirement-derived example? Answer no when the comparison is a drift or parity guard rather than a recomputation: one side is a stored artifact (a committed/golden file read from disk, a checked-in fixture, a snapshot) that generator output must match, or it round-trips an inverse operation (decode what was encoded, verify what was signed).",
  criteria: {
    true: "The test recomputes the production algorithm to build what it asserts against.",
    false: "Expected values are literals or requirement-derived examples, or the test is a drift/parity guard against a stored artifact or an inverse-operation round trip.",
  },
  threshold: 0.85,
} satisfies Check;
