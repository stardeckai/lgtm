import type { Check } from "../types.js";

export default {
  id: "happy-path-only-of-risky-boundary",
  emoji: "🙌",
  blurb: "The refusal path this code exists for, the one that pages you, has no test here or among its siblings.",
  instructions:
    "Procedure. 1. List every refusal or failure branch in `implementation`: authorization and tenant guards, duplicate or already-used rejections, version/concurrency conflicts, quota and limit caps, retry exhaustion, rollback on partial failure, over-amount money guards. 2. Name the riskiest one. 3. Search `test_code` and every `sibling_tests` name for that exact condition. A sibling covering a different branch — unknown id, not found, expiry, bad input, empty result — does not count. Answer yes when the riskiest branch is exercised by nothing. Answer no when this block itself drives that refusal (even alongside the allowed path), when a sibling drives it, or when `implementation` has no refusal branch.",
  criteria: {
    true: "Every block, this one and the siblings, stays on the allowed path; the riskiest refusal in `implementation` is driven by none of them.",
    false: "This block or a sibling name drives that exact refusal, or there is no refusal branch to miss.",
  },
  threshold: 0.65,
} satisfies Check;
