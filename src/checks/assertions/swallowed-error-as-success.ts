import type { Check } from "../types.js";

export default {
  id: "swallowed-error-as-success",
  emoji: "🔥",
  blurb: "Green. Production on fire.",
  instructions:
    "Is this test's green independent of the specific failure it claims to cover? Decide in order: (1) `test_code` exercises no refusal, invalid input, failure or fallback path → no. (2) Its expects sit inside a test-side try/catch or `.catch()` and nothing — `expect.assertions`, `rejects.`, a throw at the end of the try — forces them to run → yes, however specific the matcher inside and however surely the rigged mock throws. (3) The assertion on the caught error or rejection accepts any error: bare `toThrow()`/`rejects.toThrow()`, `toThrow(Error)`, `toBeInstanceOf(Error)`, `toBeDefined()`, or a lone `not.toThrow()` → yes. (4) `implementation` funnels every exception on that path into the asserted value — a constant fallback or default, a cached value, null, [], `ok:false`, status 200, an error count, a logged line, a counter — and nothing in the assertion is derived from the specific failure → yes, even when that value is matched exactly. Answer no whenever the error is an input rather than something the test caught, a further assertion or sibling requires it to propagate, or the asserted result names the failure — its status, code, reason, the step that failed, the attempt count, the echoed input. Else no.",
  criteria: {
    true: "An unrelated crash inside the code under test would produce the same result this test asserts.",
    false:
      "The asserted result names the claimed failure — exact error class and message, its code or status, the failing step or field, echoed input text, the exact logged reason, an attempt count — or `expect.assertions(n)`, a rethrow of unexpected error types, a further assertion requiring propagation, or a read-back proving nothing was written forces the failure path. A weak assertion on a success path, or a snapshot of an error passed in as input, is a different smell: no.",
  },
  threshold: 0.75,
} satisfies Check;
