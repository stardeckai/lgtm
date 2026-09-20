import type { Check } from "../types.js";

export default {
  id: "vacuous-assertion",
  blurb: "The assertion accepts almost any output, so it cannot fail for a real bug.",
  instructions:
    "From `implementation`, name what the call returns for this input and one realistic wrong result. Yes if every assertion in `test_code` still passes on that wrong result: toBeDefined/truthy on a value with real content; toContain or a loose regex a mis-formatted output also matches; generic properties (non-empty, positive, in range) over a table; gte against a frozen literal a growing value always clears; an equality both sides meet degenerately (both empty). No when: throw-or-not is the callee's whole contract (void guard; accept table beside a reject table); the error class or message is pinned; existence from a keyed find is the invariant; the comparison is against a second real computation, f(a) vs f(b), the bug must change; or this block also asserts an exact value. Judge this block; siblings show the contract, they do not rescue it.",
  criteria: {
    true: "Every assertion in the block also passes on a realistic wrong result.",
    false: "An assertion pins an exact value or shape, the error's identity, an existence that is itself the invariant, or a comparison against a second real computation a plausible bug would change.",
  },
  threshold: 0.70,
} satisfies Check;
