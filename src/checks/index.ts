import type { Check } from "./types.js";
import wouldPassIfBroken from "./assertions/would-pass-if-broken.js";
import vacuousAssertion from "./assertions/vacuous-assertion.js";
import assertionWeakerThanName from "./assertions/assertion-weaker-than-name.js";
import reimplementsLogic from "./mocks/reimplements-logic.js";
import mocksSeamUnderTest from "./mocks/mocks-seam-under-test.js";
import mockMirrorsImplementation from "./mocks/mock-mirrors-implementation.js";
import testsCallsNotOutcomes from "./assertions/tests-calls-not-outcomes.js";
import testsInternals from "./scope/tests-internals.js";
import setupDominates from "./scope/setup-dominates.js";
import broadSnapshot from "./assertions/broad-snapshot.js";
import swallowedErrorAsSuccess from "./assertions/swallowed-error-as-success.js";
import impossibleFixture from "./scope/impossible-fixture.js";
import happyPathOnlyOfRiskyBoundary from "./scope/happy-path-only-of-risky-boundary.js";
import trivialPrimitive from "./scope/trivial-primitive.js";
import overMocked from "./mocks/over-mocked.js";
import regressionDoesNotDistinguish from "./diff/regression-does-not-distinguish.js";
import changedInLockstep from "./diff/changed-in-lockstep.js";

export type { Check } from "./types.js";
export { TEST_CLASSES, type TestClass, CLASS_EMOJI } from "./classes.js";

/** TypeSafe list price for jev-latest: $0.042 per million input tokens, output tokens are free. */
export const USD_PER_INPUT_TOKEN = 0.042 / 1_000_000;
export const usd = (inputTokens: number) => `$${(inputTokens * USD_PER_INPUT_TOKEN).toFixed(4)}`;

/** Order is user-visible in --list-checks, the README and the Claude skill — src/checks/index.test.ts locks it. */
/** The four categories are the reaction vocabulary: one face per family, used only on finding lines. */
export const CATEGORIES = ["assertions", "mocks", "scope", "diff"] as const;
export type Category = (typeof CATEGORIES)[number];
export const GESTURE: Record<Category, string> = {
  assertions: "😐🤏", // proves this much
  mocks: "😐👏", // congratulations, you tested the mock
  scope: "😐🤌", // what exactly are we doing here
  diff: "😐🫸", // do not merge this
};
export const CATEGORY_OF: Record<string, Category> = {
  "would-pass-if-broken": "assertions",
  "vacuous-assertion": "assertions",
  "assertion-weaker-than-name": "assertions",
  "tests-calls-not-outcomes": "assertions",
  "broad-snapshot": "assertions",
  "swallowed-error-as-success": "assertions",
  "reimplements-logic": "mocks",
  "mocks-seam-under-test": "mocks",
  "mock-mirrors-implementation": "mocks",
  "over-mocked": "mocks",
  "tests-internals": "scope",
  "setup-dominates": "scope",
  "impossible-fixture": "scope",
  "happy-path-only-of-risky-boundary": "scope",
  "trivial-primitive": "scope",
  "regression-does-not-distinguish": "diff",
  "changed-in-lockstep": "diff",
};

export const CHECKS: Check[] = [
  wouldPassIfBroken,
  vacuousAssertion,
  assertionWeakerThanName,
  reimplementsLogic,
  mocksSeamUnderTest,
  mockMirrorsImplementation,
  testsCallsNotOutcomes,
  testsInternals,
  setupDominates,
  broadSnapshot,
  swallowedErrorAsSuccess,
  impossibleFixture,
  happyPathOnlyOfRiskyBoundary,
  trivialPrimitive,
  overMocked,
  regressionDoesNotDistinguish,
  changedInLockstep,
];
export { EXPLANATIONS } from "./explanations.js";
