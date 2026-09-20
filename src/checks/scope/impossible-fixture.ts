import type { Check } from "../types.js";

export default {
  id: "impossible-fixture",
  blurb: "The fixture builds a state production validation could never produce.",
  instructions:
    "Name the exact rule this fixture breaks. 1. Find the value or row the assertion depends on. 2. In `implementation`, find the writer, constructor, validator or schema that produces it. 3. Could that code ever produce this exact state? Answer yes only when you can name the rule it violates — a cap, an enum, a required field, uniqueness, or an ordering/sequence/state-transition invariant — and the asserted branch depends on that state; a seed, hydrate or restore path that skips that writer is how such a state gets in. Otherwise no: a write of a row the writer would also accept; a cast omitting fields nothing reads; casts on the call or on mocked returns; corrupt or legacy data as the declared subject. Setup size and raw SQL are not evidence.",
  criteria: {
    true: "A rule you can name in `implementation` — cap, enum, required field, uniqueness, sequence, state transition — forbids the exact fixture state, and the asserted behavior depends on it.",
    false: "No such rule can be named: production writes this state too, the impossible part is never read, or corrupt/legacy data is the declared subject.",
  },
  threshold: 0.55,
} satisfies Check;
