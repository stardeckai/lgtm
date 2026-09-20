import type { Check } from "../types.js";

export default {
  id: "reimplements-logic",
  blurb: "The expected value is computed with the same logic as production, so both can be wrong together; write the expected value by hand.",
  instructions:
    "Look only at the expected side of each assertion: the value the real output is compared against. Answer yes when that expected value is produced by the same formula, loop, template, digest or production helper `implementation` uses — retyped in the test, or called from it — so that a mistake in the algorithm appears identically on both sides and the assertion cannot disagree. That includes an expected string, key, label or row set assembled in the test from the same template, separator, namespace prefix or composition of helpers the implementation uses to build it: the shape is copied, so a wrong separator or a swapped field agrees on both sides. Answer no when the expected side is a literal or a requirement-derived example, however the input was built: production helpers or exported constants used to construct the input, seed the fixture or place it on a boundary do not count — except when the input is manufactured by running the rule under test itself, such as a number built from the validator's own weight table and modulo so the validator cannot fail, which is a yes; two production outputs compared with each other (a writer's key against a reader's prefix, two orderings that must differ, a round trip that must return) are a parity guard, not a recomputation; a property asserted over real output (key order does not matter, a one-second change flips the result) is not a recomputation; and a stored artifact — a golden file, a checked-in fixture, a snapshot, a committed generated file — compared against the generator's current output is a drift guard and always no, even though the generator is production code called from the test: the point of that test is that the artifact on disk has not drifted.",
  criteria: {
    true: "The expected side of an assertion is produced by the production algorithm or a copy of it.",
    false: "Expected values are literals or requirement-derived examples; production code only built inputs, or the assertion is a parity, property or drift guard.",
  },
  // Pinned under the fitted 0.85: one dogfood drift guard at 0.77 is the only real negative above 0.5, and the
  // real positives sit from 0.6 up. High at 0.78 keeps that guard just under the line.
  threshold: 0.6,
  high: 0.78,
  pinned: true,
} satisfies Check;
