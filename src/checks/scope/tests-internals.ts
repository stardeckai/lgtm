import type { Check } from "../types.js";

export default {
  id: "tests-internals",
  emoji: "🧠",
  blurb: "Tests how it's built, not what it does. A rename will kill it.",
  instructions:
    "Name the contract surface in `implementation`: return values, thrown errors, rendered text/roles/labels/aria/disabled/href, state read back out of storage, payloads handed to callbacks or collaborators. Answer no when `test_code` asserts on that surface — a class string that is the function's own return value counts, as does a storage round-trip. Answer yes when the asserted value is reachable only by peeking: private members or React state via an any-cast, instance or ref; class names, tag names or child counts of rendered DOM; render or stubbed-child call counts; source text; internal step or action-type order; or the shape or size of a table or bookkeeping accessor whose consuming function in `implementation` is never called.",
  criteria: {
    true: "The assertion reads something only peeking reveals; the contract surface goes unasserted.",
    false: "The assertion is on a return value, rendered text/role/aria/disabled state, or persisted or submitted state.",
  },
  threshold: 0.60,
} satisfies Check;
