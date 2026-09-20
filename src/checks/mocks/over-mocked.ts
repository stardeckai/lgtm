import type { Check } from "../types.js";

export default {
  id: "over-mocked",
  emoji: "🧱",
  blurb: "Mocks all the way down. Nothing real is left to fail.",
  instructions:
    "List the collaborators the `implementation` actually calls — imported modules, injected objects. Ignore objects built in `test_code` that never reach it. Answer yes when the faked collaborators include first-party code (repositories, stores, ORM or transaction handles, policy or rule modules, hooks, helpers) and what stays real is glue — returning a stub's value, interpolation, arithmetic, assembling stub returns — so no two real components could disagree. Two faked collaborators can be enough. Answer no when only true external edges are faked (clock, randomness, HTTP, third-party gateway, filesystem) and real logic computes the asserted value.",
  criteria: {
    true: "First-party collaborators are faked and the remaining real code is glue over stub returns.",
    false: "Only external edges are faked; real logic still computes what the test asserts.",
  },
  threshold: 0.75,
} satisfies Check;
