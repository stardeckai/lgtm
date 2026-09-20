import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { issueDue, type Subscription } from "./impl";

const DAY = 24 * 60 * 60 * 1000;

describe("issueDue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("issues nothing during the trial and then one invoice per elapsed period", () => {
    const start = Date.now();
    let subscription: Subscription = {
      id: "sub_1",
      status: "trialing",
      trialEndsMs: start + 14 * DAY,
      priceCents: 2500,
      periodMs: 30 * DAY,
      nextInvoiceMs: Number.POSITIVE_INFINITY,
    };

    vi.advanceTimersByTime(10 * DAY);
    let result = issueDue(subscription, Date.now());
    expect(result.invoices).toEqual([]);
    expect(result.subscription.status).toBe("trialing");

    vi.advanceTimersByTime(55 * DAY);
    result = issueDue(result.subscription, Date.now());
    expect(result.invoices).toEqual([
      { subscriptionId: "sub_1", amountCents: 2500, issuedAtMs: start + 14 * DAY },
      { subscriptionId: "sub_1", amountCents: 2500, issuedAtMs: start + 44 * DAY },
    ]);
    expect(result.subscription.nextInvoiceMs).toBe(start + 74 * DAY);
  });
});
