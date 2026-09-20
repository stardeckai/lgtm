import { describe, expect, it } from "vitest";
import { applyRefund, type Charge } from "./impl";

describe("applyRefund", () => {
  it("refuses to refund more than was captured", () => {
    const charge: Charge = { id: "ch_1", capturedCents: 5000, refundedCents: 3000 };

    expect(applyRefund(charge, 2000).refundedCents).toBe(5000);
    expect(() => applyRefund(charge, 2001)).toThrow(/exceeds captured amount/);
  });
});
