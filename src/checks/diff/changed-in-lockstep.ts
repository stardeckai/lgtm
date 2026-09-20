import type { Check } from "../types.js";

export default {
  id: "changed-in-lockstep",
  blurb: "Implementation and expected values changed together, so the test may only mirror the new behaviour.",
  instructions:
    "Procedure. 1. Look at the test file's side of `diff`. If it is all additions — no removed (`-`) assertion line — nothing was rewritten to match the implementation: answer no. 2. Otherwise pair each edited expectation with the implementation line in `diff` that produces it. Answer yes when an expected literal that already existed was rewritten to the new output, so the test now records the change instead of requiring it. Answer no when the asserted values are unchanged and only the call shape, signature or types moved, or when the expectation states a requirement decided independently of the implementation.",
  criteria: {
    true: "The test's expectations were edited to match the new implementation output.",
    false: "The test expresses a requirement that was decided independently of the implementation change.",
  },
  threshold: 0.75,
  diffOnly: true,
} satisfies Check;
