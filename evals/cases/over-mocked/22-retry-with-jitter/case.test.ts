import { describe, expect, it, vi } from "vitest";
import { retryPlan, withRetries } from "./impl";

describe("withRetries", () => {
  it("sleeps the capped, jittered backoff between attempts and rethrows the last failure", async () => {
    const plan = retryPlan(3, 100, 300, () => 0.5);
    expect(plan).toEqual([
      { attempt: 1, delayMs: 75 },
      { attempt: 2, delayMs: 150 },
      { attempt: 3, delayMs: 225 },
    ]);

    const slept: number[] = [];
    const sleep = async (ms: number) => void slept.push(ms);
    const operation = vi.fn().mockRejectedValue(new Error("upstream down"));

    await expect(withRetries(plan, sleep, operation)).rejects.toThrow("upstream down");
    expect(slept).toEqual([75, 150, 225]);
  });
});
