import type { Check } from "../types.js";

export default {
  id: "tests-internals",
  blurb: "It asserts private state, class names or call order instead of observable behaviour; a refactor breaks it, a bug does not.",
  instructions:
    "Judge only the values this block asserts; casts, mocks and fixtures in setup do not count. Answer no when the asserted value is a return value or thrown error; rendered text, role, aria, disabled or href; state read back out of storage; the arguments or payload a spy recorded for a collaborator, vendor SDK or callback (toHaveBeenCalledWith, mock.calls[0][1]), including an assertion that one was not called; a retry or in-flight count measured at an injected boundary; events, or their order, delivered to an external consumer; or two shipped artifacts asserted to agree. Answer yes only when the value takes peeking: private fields, React state or refs via an any-cast; CSS classes, tags or child counts of rendered DOM; render counts of stubbed children; the unit's own source text; the bare action types or step order the unit dispatches to a reducer or store this test never runs; or the shape of a table whose consuming function is never called.",
  criteria: {
    true: "The asserted value is reachable only by peeking at internals, and the contract surface goes unasserted.",
    false: "The asserted value is a return, thrown error, rendered text/role/state, persisted state, or a payload, argument or count recorded at a collaborator or injected boundary.",
  },
  threshold: 0.65,
} satisfies Check;
