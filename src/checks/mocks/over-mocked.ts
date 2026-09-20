import type { Check } from "../types.js";

export default {
  id: "over-mocked",
  blurb: "Every asserted value came out of a fake; the only real code left is glue between stubs. Fake fewer collaborators, or test the integration.",
  instructions:
    "List the first-party collaborators the entry point in `implementation` calls on the asserted path, and mark which are fakes in `test_code`. Ignore fakes the path never reaches; treat a real test database, an in-memory store with read-your-writes or an in-process app as real, not a fake; a clock, network, vendor SDK or OS process is an external edge and does not count either way. Answer yes when the collaborators that make the decisions the test name promises are all fakes, so that what still runs for real is only glue: forwarding a stub's return, echoing or prefixing it, interpolating it into a string, adding up numbers the stubs supplied, four lines that call the stubs in order. Trivial real glue on the path does not make it a no. Answer no when a real collaborator or the entry point itself makes a decision an assertion depends on: a precondition guard on a fetched row or header, a branch taken, a loop bound or cursor, a selection, a date or version computation, a refusal or an ordering the fakes did not script, or what real code does with an error a fake threw — inspecting it, rethrowing it, swallowing it. One fake at the edge with everything else real is never over-mocked, whatever it returns or throws. Faking first-party data sources is not by itself the smell.",
  criteria: {
    true: "The collaborators that make the promised decisions are all fakes; only glue between them runs for real.",
    false: "A real collaborator or the entry point decides an asserted value, or the swapped module is a real test store.",
  },
  threshold: 0.55,
} satisfies Check;
