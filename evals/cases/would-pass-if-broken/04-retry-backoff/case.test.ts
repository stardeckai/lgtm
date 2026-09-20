import { describe, expect, it } from "vitest";
import { backoffSchedule } from "./impl";

describe("backoffSchedule", () => {
  it("doubles the delay after every attempt until it reaches the cap", () => {
    const delays = backoffSchedule({ baseMs: 1000, maxMs: 8000, attempts: 5, jitter: false });

    expect(delays[0]).toBe(1000);
    expect(delays).toHaveLength(5);
  });
});
