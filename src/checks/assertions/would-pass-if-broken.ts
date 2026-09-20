import type { Check } from "../types.js";

export default {
  id: "would-pass-if-broken",
  blurb: "Break the behaviour the name describes and this test still passes; the fixture never reaches it.",
  instructions:
    "Would `test_code` still pass if the behaviour `test_name` (under `describe_path`) names were broken in an obvious way? Procedure: name the branch, guard, filter or computation the name promises; ask whether this fixture actually exercises it; then break that one thing and re-run. Yes if every assertion still holds, and say which escape: the fixture sits on the safe side (nothing archived, one tenant, 3 of a limit of 5, a weekday); a plausible alternative computes the same value on this input; the matcher never exposes the qualifier the name promises (toContain, a regex, length, expect.any, gte against a value that only rises); the asserted value comes from a stub or a second path; or the assertion sits inside an `if` or loop this fixture may not enter. No when the named behaviour's own output on this input is exactly what is asserted — even when that output is a constant, `''`, `null`, `[]`, not throwing, or a call that must not happen.",
  criteria: {
    true: "An obvious break of the named behaviour leaves every assertion satisfied, and you can name the escape route that keeps them green.",
    false: "Breaking the named behaviour changes at least one asserted value, including a constant, empty, null, not-thrown or not-called outcome when that is what the name claims.",
  },
  threshold: 0.60,
} satisfies Check;
