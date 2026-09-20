import type { Check } from "../types.js";

export default {
  id: "vacuous-assertion",
  blurb: "The assertion (toBeDefined, truthy, length ≥ 0) accepts wrong output too; pin the exact value a bug would change.",
  instructions:
    "First decide what the call under test does on a bad input or a bad response. If `implementation` shows it validates, parses or schema-checks and throws on failure, and `test_name` promises no more than that the call succeeds, parses, streams without error or completes, then an awaited call that returned at all is that success, and a defined, non-empty or non-error check on its result is not vacuous: answer no. If the name promises content, a value, a shape, a count or a behaviour beyond success, that rule does not apply; go on. Otherwise, from `implementation`, name what the call returns for this input and one realistic wrong result, and answer yes if every assertion in `test_code` still passes on that wrong result: toBeDefined/truthy on a value with real content; toContain or a loose regex a mis-formatted output also matches; generic properties (non-empty, positive, in range, a known key, no underscore) checked in a loop over a table or dictionary, which a wholesale swap of the values also satisfies; gte against a frozen literal a growing value always clears, or a time at or after a line above that any later clock also clears; an equality both sides meet degenerately (both empty, both undefined, a function that returns undefined on every path); or assertions that sit inside an `if` or loop this fixture may skip, leaving only a length or existence check unconditional. Also no when: throw-or-not is the callee's whole contract (a void guard; an accept table beside a reject table); the error class or message is pinned; existence from a keyed find is the invariant; the comparison is against a second real computation, f(a) vs f(b), the bug must change; or this block also asserts an exact value. Judge this block; siblings show the contract, they do not rescue it.",
  criteria: {
    true: "Every assertion in the block also passes on a realistic wrong result.",
    false: "An assertion pins an exact value or shape, the error's identity, an existence that is itself the invariant, a comparison against a second real computation a plausible bug would change, or the success of a call whose whole contract is to throw on bad input.",
  },
  // Pinned under the fitted 0.65; the high line at 0.75 rather than the standard +0.15.
  threshold: 0.58,
  high: 0.75,
  pinned: true,
} satisfies Check;
