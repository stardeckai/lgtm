import { DEFAULT_THRESHOLD, type Check } from "../types.js";

export default {
  id: "mocks-seam-under-test",
  emoji: "👏",
  blurb: "The collaborator that decides this behaviour is a mock, so the test only proves the mock works.",
  instructions:
    "Name the behaviour the test claims — a refusal, a match, single-use, atomicity, a write landing, keys agreeing — and find in `implementation` which collaborator decides it. Smell it when that collaborator is a scripted mock in `test_code`: the asserted outcome is what the mock was told, its canned read cannot reflect the write, it hands back the very value the real code was meant to check against, both halves of a round trip are scripted, or the only evidence is that it was called. Before answering yes, rule out: the asserted value was derived by real code and merely handed to a fake (a path id, a verb→flag mapping, a forwarded target, a batch count); the asserted state is read back from a real database, store or rendered component; a stub's value deliberately differs from a second real source so the assertion shows which won; only neighbours are faked — signer, mailer, clock, metrics, vendor SDK, network — while the deciding code runs.",
  criteria: {
    true: "The collaborator that decides the named behaviour is itself the scripted mock.",
    false: "Only neighbours are faked, or the asserted value was derived by the real code that owns the behaviour.",
  },
  threshold: DEFAULT_THRESHOLD,
} satisfies Check;
