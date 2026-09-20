import { describe, expect, it } from "vitest";
import { RefundService } from "./impl";

describe("RefundService", () => {
  it("does not refund twice for a repeated request id", () => {
    const service = new RefundService();
    service.addPayment({ id: "pay_1", capturedCents: 5000, refundedCents: 0 });

    const result = service.refund("pay_1", "req-88", 2500);

    expect(result.refundedCents).toBe(2500);
  });
});
