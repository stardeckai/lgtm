import { describe, expect, it } from "vitest";
import { priceAfterCoupons } from "./impl";

describe("priceAfterCoupons", () => {
  it("never compounds two coupons on one order", () => {
    expect(priceAfterCoupons(10000, [{ code: "SPRING", percentOff: 20 }])).toBe(8000);
    expect(priceAfterCoupons(10000, [])).toBe(10000);
  });
});
