import { DEFAULT_THRESHOLD, type Check } from "../types.js";

export default {
  id: "swallowed-error-as-success",
  blurb: "The test stays green whether the error is caught, logged, or never thrown; it never pins the specific failure.",
  instructions:
    "Does this test stay green whether or not the failure it names actually happens? In order: (1) this block exercises no failure, refusal or fallback path → no. (2) Its expects sit inside a test-side try/catch or `.catch()` and nothing — `expect.assertions`, `rejects.`, a trailing throw — forces them to run → yes, however exact the matcher inside. (3) Else no if any holds: the asserted path is the accepting one (`not.toThrow()`, a success value); the asserted status is an error status the caller can act on (4xx/5xx) rather than the route's success answer; a sibling name shows the same unit answering something this asserted value cannot be, so an implementation that always answered this way would fail there; the asserted result names this failure's class, code, reason, failing step or count, including a fail-closed mapping whose category is the declared contract. (4) Else yes if the assertion on the caught error or rejection accepts any error (bare `toThrow()`/`rejects.toThrow()`, `toThrow(Error)`, `toBeInstanceOf(Error)`, `toBeDefined()`), or `implementation` funnels every exception on this path into the asserted value — a constant fallback, null, [], `ok:false`, 200, a cached value, a count, a logged line — even when matched exactly.",
  criteria: {
    true: "An unrelated crash inside the code under test would produce the same result this test asserts.",
    false:
      "The asserted result names this failure rather than the neighbouring one — its class, code, status, failing step, echoed reason, attempt count, or a status a sibling running the same fixture without this failure does not return — or it is the declared output of a fail-closed mapping; a sibling pins a non-fallback result from the same unit so a blanket fallback could not stay green; the block drives the accepting path or no failure path at all; or `expect.assertions(n)`, a rethrow of unexpected types, or a read-back proving nothing was written forces the failure path.",
  },
  threshold: DEFAULT_THRESHOLD,
} satisfies Check;
