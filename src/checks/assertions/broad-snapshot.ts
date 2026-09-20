import type { Check } from "../types.js";

export default {
  id: "broad-snapshot",
  emoji: "📸",
  blurb: "Snapshot crime. Nobody will read it, everybody will update it.",
  instructions:
    "Does `test_code` rely on a snapshot so broad that a reviewer cannot tell which behavior it protects, and would likely re-record it rather than investigate a diff?",
  threshold: 0.30,
} satisfies Check;
