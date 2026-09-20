import { describe, expect, test } from "vitest";
import { SlidingLimiter } from "./impl";

describe("SlidingLimiter", () => {
  test("keys are limited independently and each window reopens exactly one period after its first hit", () => {
    const limiter = new SlidingLimiter(3, 60_000);
    const t0 = 1_700_000_000_000;

    expect(limiter.allow("tenant_a", t0)).toBe(true);
    expect(limiter.allow("tenant_b", t0 + 5_000)).toBe(true);
    expect(limiter.allow("tenant_a", t0 + 10_000)).toBe(true);
    expect(limiter.allow("tenant_b", t0 + 15_000)).toBe(true);
    expect(limiter.allow("tenant_a", t0 + 20_000)).toBe(true);
    expect(limiter.allow("tenant_a", t0 + 25_000)).toBe(false);
    expect(limiter.remaining("tenant_a", t0 + 25_000)).toBe(0);
    expect(limiter.remaining("tenant_b", t0 + 25_000)).toBe(1);
    expect(limiter.allow("tenant_c", t0 + 25_000)).toBe(true);

    expect(limiter.allow("tenant_a", t0 + 59_999)).toBe(false);
    expect(limiter.allow("tenant_a", t0 + 60_000)).toBe(true);
    expect(limiter.remaining("tenant_a", t0 + 60_000)).toBe(2);
    expect(limiter.remaining("tenant_b", t0 + 60_000)).toBe(1);
    expect(limiter.allow("tenant_b", t0 + 65_000)).toBe(true);
    expect(limiter.remaining("tenant_b", t0 + 66_000)).toBe(2);
  });
});
