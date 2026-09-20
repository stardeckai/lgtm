import { describe, expect, it } from "vitest";
import { refundBreakdown } from "./impl";

describe("refundBreakdown", () => {
  it("returns the processing fee pro rata, rounding the fraction of a cent down", () => {
    expect(refundBreakdown({ chargeCents: 9999, feeCents: 320, refundCents: 3333 })).toEqual({
      toCustomerCents: 3333,
      feeReturnedCents: 106,
      netCents: 6452,
    });
    expect(() => refundBreakdown({ chargeCents: 500, feeCents: 20, refundCents: 501 })).toThrow(RangeError);
  });
});
