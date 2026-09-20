import { describe, expect, it, vi } from "vitest";
import { SlidingWindowLimiter } from "./impl";

describe("SlidingWindowLimiter", () => {
  it("blocks the third call in the window and reports when it may be retried", () => {
    const clock = vi.fn<[], number>();
    clock.mockReturnValueOnce(1_000).mockReturnValueOnce(1_400).mockReturnValueOnce(1_500);
    const limiter = new SlidingWindowLimiter(2, 1_000, clock);

    expect(limiter.take("ip-1")).toEqual({ allowed: true, remaining: 1, retryAfterMs: 0 });
    expect(limiter.take("ip-1")).toEqual({ allowed: true, remaining: 0, retryAfterMs: 0 });
    expect(limiter.take("ip-1")).toEqual({ allowed: false, remaining: 0, retryAfterMs: 500 });
  });
});
