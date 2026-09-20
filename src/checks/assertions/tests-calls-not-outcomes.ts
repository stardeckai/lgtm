import type { Check } from "../types.js";

export default {
  id: "tests-calls-not-outcomes",
  emoji: "🙏",
  blurb: "It was called. Please, one assertion about what happened next.",
  instructions:
    "Does `test_code` assert only that something was called (toHaveBeenCalled, call counts) without meaningful arguments or resulting observable state, in a case where making the call is not itself the public contract?",
  criteria: {
    true: "The only evidence is that a call happened; arguments and resulting state go unchecked.",
    false: "Meaningful arguments or observable results are asserted, or the call itself is the contract.",
  },
  threshold: 0.30,
} satisfies Check;
