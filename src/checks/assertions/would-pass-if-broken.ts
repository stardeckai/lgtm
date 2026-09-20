import type { Check } from "../types.js";

export default {
  id: "would-pass-if-broken",
  blurb: "Remove the behaviour in the name and every assertion stays green: the fixture never reaches that branch. Move it to the failing side.",
  instructions:
    "Would an obvious break of the behaviour this test names make at least one of its assertions fail? 1. From `test_name` under `describe_path`, name the one thing the test promises: a branch, a guard, a filter, a qualifier, a computation. 2. Write down the obvious broken version — the guard deleted, the filter removed, the branch always taken, the computation replaced by its naive form (round for floor, shallow for deep, first for best, no reset, no cap). 3. Run the fixture in `test_code` through that broken version and write down what each asserted expression evaluates to. 4. Answer yes when at least one assertion now fails — including when the correct value is a constant, `''`, `null`, `[]`, not throwing or not calling and the broken version changes it. Answer no when every assertion still holds, and name why: there is no assertion, or every assertion sits inside an `if`, a loop or a `catch` the fixture may skip; the fixture sits on the safe side (nothing archived, one tenant, 3 of a limit of 5, a weekday, the owner is also the admin, the first warehouse has it all); the naive computation gives the same value on this input (flat objects, 3.0, a .png name beside a png header); the matcher hides the qualifier (toContain, a regex, a length, expect.any, gte on a value that only rises); the asserted value comes from a stub or a second path; the assertions only cover things the name never promised.",
  criteria: {
    true: "The obvious broken version changes at least one asserted value on this fixture, so the test would go red.",
    false: "Every assertion still holds under the obvious broken version, or there is no assertion this fixture is sure to reach.",
  },
  threshold: 0.35,
  invert: true,
} satisfies Check;
