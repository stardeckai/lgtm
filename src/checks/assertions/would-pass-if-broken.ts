import type { Check } from "../types.js";

export default {
  id: "would-pass-if-broken",
  emoji: "🚪",
  blurb: "Break the behaviour the name describes and this test still passes; the fixture never reaches it.",
  instructions:
    "Would `test_code` still pass if the behavior `test_name` (under `describe_path`) names were broken in an obvious way? Procedure: name the branch, guard, or computation the name promises; check whether this fixture actually exercises it, or whether an earlier return, a default, a fallback, a stub's canned value, or a coincidence in the fixture already yields the asserted values; then break that behavior and re-run the fixture. Yes if every assertion still holds. No when the assertions pin the exact output the named behavior itself produces.",
  criteria: {
    true: "An obvious break of the named behavior leaves every assertion satisfied — the fixture sits on the safe side of the branch, or the asserted values come from a default, a stub, or another path.",
    false: "At least one assertion fails once the named behavior is broken.",
  },
  threshold: 0.60,
} satisfies Check;
