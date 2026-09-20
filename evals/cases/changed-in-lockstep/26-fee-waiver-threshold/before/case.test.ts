import { describe, expect, it } from "vitest";
import { checkoutTotalCents, type Ticketed } from "./impl";

describe("checkoutTotalCents", () => {
  it("charges a booking fee for every ticket in the basket", () => {
    const basket: Ticketed[] = [
      { faceValueCents: 4500, bookingFeeCents: 250 },
      { faceValueCents: 4500, bookingFeeCents: 250 },
    ];

    expect(checkoutTotalCents(basket)).toBe(9500);
  });
});
