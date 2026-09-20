import { describe, expect, it, vi } from "vitest";
import { processRefund } from "./impl";

describe("processRefund", () => {
  it("refunds an order within the policy limit", async () => {
    const orders = { get: vi.fn().mockResolvedValue({ id: "o-1", paidCents: 5_000, refundedCents: 0 }) };
    const payments = { refund: vi.fn().mockResolvedValue({ id: "re_1" }) };
    const policy = { maxRefundCents: vi.fn().mockResolvedValue(5_000) };
    const notifier = { refunded: vi.fn().mockResolvedValue(undefined) };

    const result = await processRefund(orders, payments, policy, notifier, {
      orderId: "o-1",
      reason: "damaged",
      requestedBy: "u-2",
    });

    expect(result).toEqual({ refundId: "re_1", cents: 5_000 });
  });
});
