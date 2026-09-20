import { describe, expect, it, vi } from "vitest";
import { handleDeliveryResult, type DeadLetters, type RetryScheduler } from "./impl";

describe("handleDeliveryResult", () => {
  it("backs off before the third attempt", () => {
    const scheduler: RetryScheduler = { schedule: vi.fn() };
    const deadLetters: DeadLetters = { park: vi.fn() };

    handleDeliveryResult(scheduler, deadLetters, { id: "d-3", attempt: 2, lastStatus: 503 });

    expect(scheduler.schedule).toHaveBeenCalledTimes(1);
    expect(deadLetters.park).toHaveBeenCalledTimes(0);
  });
});
