import { describe, expect, it } from "vitest";
import { refund, type Donation } from "./impl";

const donation: Donation = {
  id: "gift-9",
  cents: 5000,
  madeAt: 1_700_000_000_000,
  refunded: false,
};
const day = 24 * 60 * 60 * 1000;

describe("refund", () => {
  it("stops refunding a gift once the thirty-day window has closed", () => {
    expect(refund(donation, donation.madeAt + 29 * day).refunded).toBe(true);
    expect(() => refund(donation, donation.madeAt + 31 * day)).toThrow(
      "refund window closed",
    );
  });
});
