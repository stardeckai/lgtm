import { describe, expect, it } from "vitest";
import { formatPaymentAmount, type PaymentRow } from "./impl";

describe("formatPaymentAmount", () => {
  it("reads rows written before the currency column existed as dollars", () => {
    const legacyRow = { id: "pay_1998", amountMinor: 4599 } as PaymentRow;

    expect(formatPaymentAmount(legacyRow)).toBe("45.99 USD");
  });
});
