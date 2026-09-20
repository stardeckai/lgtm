import type { Check } from "../types.js";

export default {
  id: "would-pass-if-broken",
  emoji: "🚪",
  blurb: "The feature could leave the building. This test would wave.",
  instructions:
    "Would `test_code` still pass if the behavior its name (`test_name`, under `describe_path`) describes were broken in an obvious way in `implementation`?",
  criteria: {
    true: "An obvious break of the named behavior would leave every assertion in the test satisfied.",
    false: "At least one assertion fails once the named behavior is broken.",
  },
  threshold: 0.35,
} satisfies Check;
