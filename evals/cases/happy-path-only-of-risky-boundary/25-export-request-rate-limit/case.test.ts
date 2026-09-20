import { describe, expect, it } from "vitest";
import { RateLimiter } from "./impl";

describe("RateLimiter.take", () => {
  it("refuses the request that goes over the limit and says how long to wait", () => {
    const limiter = new RateLimiter(2, 60_000);

    expect(limiter.take("org_a", 0)).toEqual({ allowed: true, remaining: 1, retryAfterMs: 0 });
    expect(limiter.take("org_a", 10_000)).toEqual({ allowed: true, remaining: 0, retryAfterMs: 0 });
    expect(limiter.take("org_a", 20_000)).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 40_000,
    });
  });

  it("starts a fresh window once the old one has elapsed", () => {
    const limiter = new RateLimiter(1, 60_000);
    limiter.take("org_a", 0);

    expect(limiter.take("org_a", 60_000).allowed).toBe(true);
  });
});
