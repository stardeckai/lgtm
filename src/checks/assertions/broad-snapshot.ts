import type { Check } from "../types.js";

export default {
  id: "broad-snapshot",
  emoji: "📸",
  blurb: "The snapshot pins everything and explains nothing, so it will be re-recorded on the next change.",
  instructions:
    "Does `test_code` rely on a snapshot so broad that a reviewer cannot tell which behavior it protects, and would likely re-record it rather than investigate a diff?",
  threshold: 0.45,
} satisfies Check;
