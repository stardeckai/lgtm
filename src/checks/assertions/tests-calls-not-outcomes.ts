import type { Check } from "../types.js";

export default {
  id: "tests-calls-not-outcomes",
  blurb: "It asserts that a function was called, not what happened as a result.",
  instructions:
    "Answer no when the call — or its absence — is the unit's whole observable effect: `not.toHaveBeenCalled` on a guard, refusal, isolation fence or never-charged path; a UI callback prop fired by an interaction; counts pinned across several fake-clock ticks or throttle windows; an outbound request whose target and payload are pinned. Also no when the block pins a concrete returned value, thrown error, response body or real unfaked state. Otherwise ask: does `implementation` derive something before the call — a key, ciphertext, capped amount, recipient set, command string, ordering, which rows — that no assertion pins concretely? Then yes, including a bare count on the collaborator whose argument carries that value. `resolves.toBeDefined()`, `expect.any(...)` on the discriminating field, arguments echoing the test's inputs, and checking only the first of several calls are not evidence.",
  criteria: {
    true: "The unit derives a value or selection that no assertion pins; the only evidence is that a double was touched.",
    false: "The call or its absence is the unit's whole effect, or a concrete result, error or state is pinned.",
  },
  threshold: 0.65,
} satisfies Check;
