import type { Check } from "../types.js";

export default {
  id: "happy-path-only-of-risky-boundary",
  blurb: "The refusal path this code exists for (the reject, the limit, the wrong tenant) has no test here or among its siblings; add one.",
  instructions:
    "Is the riskiest refusal in `implementation` exercised somewhere in this file, or is there none to exercise? Procedure. 1. List every refusal or failure branch in `implementation`: authorization and tenant guards, duplicate or already-used rejections, version/concurrency conflicts, quota and limit caps, retry exhaustion, rollback on partial failure, over-amount money guards, a rejection that must propagate unchanged, a second request that must not bypass a hold. 2. Name the riskiest one. 3. Search `test_code` and every `sibling_tests` name for that exact condition. Answer yes when this block drives it — the block is itself the failure path, or refuses alongside the allowed path — or a sibling name drives that exact condition, or `implementation` has no refusal branch at all (a pure extractor, formatter or mapper). Answer no when the riskiest branch is exercised by nothing: every block stays on the allowed side, and a sibling covering a different branch — unknown id, not found, expiry, bad input, empty result — does not count.",
  criteria: {
    true: "This block or a sibling drives the riskiest refusal in the implementation, or there is no refusal branch to miss.",
    false: "Every block, this one and the siblings, stays on the allowed path; the riskiest refusal is driven by none of them.",
  },
  // Pinned under the fitted 0.80, which one real negative at 0.71 forces (an it.each sibling covers its refusals
  // and the rows never reach the model; see TODO.md). Real positives run 0.70–0.80.
  threshold: 0.65,
  high: 0.75,
  pinned: true,
  invert: true,
} satisfies Check;
