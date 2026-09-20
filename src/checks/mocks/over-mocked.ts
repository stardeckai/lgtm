import type { Check } from "../types.js";

export default {
  id: "over-mocked",
  blurb: "So many collaborators are faked that only glue is left to fail.",
  instructions:
    "Trace each asserted value backwards through `implementation` from the entry point. Ignore faked modules the asserted path never reaches, and treat a module swapped for a real test database, an in-memory store with read-your-writes, or an in-process app as real, not a fake. Answer yes when every asserted value was already inside a fake — a stub's return echoed, forwarded, interpolated or prefixed, an argument handed to a stub, or arithmetic whose stub inputs are tuned so every branch yields the same answer — and the decision the test name promises is itself stubbed. Answer no when real code on that path decides an asserted value: a precondition guard on a fetched row or header, a branch, a loop bound or cursor, a selection, date or version arithmetic. Faking first-party data sources is not by itself the smell.",
  criteria: {
    true: "Every asserted value came out of a fake; the decision the name promises is stubbed.",
    false: "Real code on the asserted path decides an asserted value, or the swapped module is a real test store.",
  },
  threshold: 0.55,
} satisfies Check;
