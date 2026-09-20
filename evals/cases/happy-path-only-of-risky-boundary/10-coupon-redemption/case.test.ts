import { describe, expect, it } from "vitest";
import { RedemptionLedger, type Coupon } from "./impl";

const coupon: Coupon = { code: "SPRING20", percentOff: 20, expiresAtMs: 5_000, oncePerCustomer: true };

describe("RedemptionLedger.redeem", () => {
  it("takes the percentage off the subtotal", () => {
    const ledger = new RedemptionLedger();

    expect(ledger.redeem(coupon, "cus_1", 1_000, 4_999)).toBe(1_000);
  });

  it("throws once the coupon has expired", () => {
    const ledger = new RedemptionLedger();

    expect(() => ledger.redeem(coupon, "cus_1", 9_000, 1_000)).toThrow("coupon expired");
  });

  it("lets a different customer redeem the same code", () => {
    const ledger = new RedemptionLedger();
    ledger.redeem(coupon, "cus_1", 1_000, 1_000);

    expect(ledger.redeem(coupon, "cus_2", 1_000, 1_000)).toBe(200);
  });
});
