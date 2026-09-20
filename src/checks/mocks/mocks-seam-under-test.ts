import type { Check } from "../types.js";

export default {
  id: "mocks-seam-under-test",
  blurb: "The collaborator that decides this behaviour is a mock, so the test proves the mock's script, not the code; use the real one here.",
  instructions:
    "Does the real collaborator that decides the behaviour this test claims run here, with an assertion depending on what it did? Name the behaviour the test claims — a refusal, a match, single-use, atomicity, a write landing, keys agreeing — and find in `implementation` which collaborator decides it. Answer no when that collaborator is a scripted mock in `test_code`: the asserted outcome is what the mock was told, its canned read cannot reflect the write, it hands back the very value the real code was meant to check against, both halves of a round trip are scripted, or the only evidence is that it was called. Also no when the claimed behaviour is a write or a call and the only evidence for it is expect(mock).toHaveBeenCalledWith on a bare vi.fn, with nothing read back. Answer yes when any of these holds: the fake has state or behaviour of its own (it throws when a precondition holds, remembers what was set, answers differently on a second call) and the real code's ordering or reaction to it is what the assertion pins; the asserted value was derived by real code and merely handed to a fake (a path id, a verb→flag mapping, a forwarded target, a batch count); the asserted state is read back from a real database, store or rendered component; a stub's value deliberately differs from a second real source so the assertion shows which won; only neighbours are faked — signer, mailer, clock, metrics, vendor SDK, OS processes, a network call whose reply the real code then interprets — while the deciding code runs. A route stub, a fetch mock or a mocked first-party module is not a neighbour when the asserted text or status is the value it returned unchanged: then it is the seam and the answer is no.",
  criteria: {
    true: "The collaborator that decides the named behaviour runs for real and an assertion depends on what it did.",
    false: "The deciding collaborator is a scripted mock, so the assertion only reads back what the mock was told.",
  },
  // Pinned under the fitted 0.95: catches 7 of 10 real positives and fires on 2 of 25 real negatives, both the
  // "stub feeds a fact the real code carries" shape the labels and the model disagree on. Six variants this round
  // (see iterations.json); the next lever is a harvest of real positives, not more wording.
  threshold: 0.84,
  high: 0.9,
  pinned: true,
  invert: true,
} satisfies Check;
