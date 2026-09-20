import { describe, expect, it } from "vitest";
import { applyCoupon, ValidationError } from "./impl";

describe("applyCoupon", () => {
  it("refuses an expired coupon with a validation error naming the code field", () => {
    const coupon = { code: "SPRING", expiresAt: "2024-03-31T23:59:59.000Z", minSpendCents: 1000 };

    expect(() => applyCoupon(coupon, 5000, "2024-04-01T00:00:01.000Z")).toThrow(ValidationError);
    expect(() => applyCoupon(coupon, 5000, "2024-04-01T00:00:01.000Z")).toThrow(
      "coupon SPRING expired on 2024-03-31T23:59:59.000Z",
    );
    expect(applyCoupon(coupon, 5000, "2024-03-01T00:00:00.000Z")).toBe(4500);
  });
});
