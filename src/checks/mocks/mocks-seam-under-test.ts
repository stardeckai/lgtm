import type { Check } from "../types.js";

export default {
  id: "mocks-seam-under-test",
  emoji: "👏",
  blurb: "The collaborator that decides this behaviour is a mock, so the test only proves the mock works.",
  instructions:
    "Name the behaviour the test title claims — a refusal, a match, single-use, atomicity, a write landing, a key agreeing. In `implementation`, find which collaborator decides it. Smell if that collaborator is a scripted mock in `test_code`: the asserted outcome is what the mock was told, its canned read cannot reflect the write, it hands back the very value the real code is meant to check against, or the only evidence is that it was called. No when just neighbours are faked — signer, mailer, clock, metrics, downstream HTTP — and the asserted values, including arguments passed to them, come from real code, or real code's own branch kept a fake uncalled.",
  criteria: {
    true: "The collaborator that decides the named behaviour is itself the scripted mock.",
    false: "Only neighbours are faked; the code owning the named behaviour runs for real.",
  },
  threshold: 0.70,
} satisfies Check;
