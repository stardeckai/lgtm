import { describe, expect, it } from "vitest";
import { receiptLine, type Converter, type Money } from "./impl";

const digits: Record<string, number> = { USD: 2, EUR: 2, JPY: 0 };
const rates: Record<string, number> = { "USD->JPY": 152.4 };

const converter: Converter = {
  convert(amount: Money, target: string): Money {
    const rate = rates[`${amount.currency}->${target}`]!;
    const major = amount.minorUnits / 10 ** (digits[amount.currency] ?? 2);
    return { currency: target, minorUnits: Math.round(major * rate * 10 ** (digits[target] ?? 2)) };
  },
};

describe("receiptLine", () => {
  it("renders a yen amount with no decimal places", () => {
    expect(receiptLine(converter, { currency: "USD", minorUnits: 2599 }, "JPY")).toBe("3961 JPY");
  });
});
