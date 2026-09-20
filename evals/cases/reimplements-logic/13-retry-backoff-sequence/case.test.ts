import { describe, expect, it } from "vitest";
import { backoffSchedule, type BackoffPolicy } from "./impl";

describe("backoffSchedule", () => {
  it("doubles each delay until it reaches the cap", () => {
    const policy: BackoffPolicy = { baseMs: 250, capMs: 8000, attempts: 7, jitter: false };

    const expected = Array.from({ length: policy.attempts }, (_, attempt) =>
      Math.min(policy.capMs, policy.baseMs * 2 ** attempt),
    );

    expect(backoffSchedule(policy, () => 1)).toEqual(expected);
  });
});
