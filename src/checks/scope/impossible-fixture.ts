import type { Check } from "../types.js";

export default {
  id: "impossible-fixture",
  blurb: "The fixture is a state production validation could never produce, so the branch it exercises cannot happen; build it through the real constructor or validator.",
  instructions:
    "First decide where the fixture goes. If it is handed to the validator, schema, parser, writer or plausibility check that forbids it, and the assertion is that refusal — a throw, a safeParse failure, an error list, a false, a flagged row — then the fixture is the test's declared bad input and the answer is no, however impossible it looks. Answer yes only when the state gets past that rule without the rule running: it is seeded, hydrated, cast or pushed straight into a store, a map or a reader, and the asserted behaviour is what code downstream of the rule does with it. A beforeEach, a seed helper, a raw insert or a literal row that the writer would have refused counts as past the rule even though the writer is never called in the test: that bypass is exactly how such a state gets in, and the reader, calculator or branch under test then depends on a row that cannot exist. The one exception: when the test name or the code under test says the point is tolerating legacy, migrated or corrupt rows, that row is the declared subject and the answer is no. Then name the exact rule: 1. find the value or row the assertion depends on; 2. in `implementation`, find the writer, constructor, validator or schema that produces it; 3. name the cap, enum, required field, uniqueness or ordering/sequence/state-transition invariant it violates. No rule you can name, no smell: a row the writer would also accept; a cast omitting fields nothing reads; casts on the call or on mocked returns. Setup size and raw SQL are not evidence.",
  criteria: {
    true: "A rule you can name in `implementation` forbids the fixture state, the fixture reaches code past that rule without the rule running, and the asserted behaviour depends on it.",
    false: "The fixture is the bad input the rule under test is asked to reject, or no rule can be named: production writes this state too, or the impossible part is never read.",
  },
  threshold: 0.50,
} satisfies Check;
