import { describe, expect, it } from "vitest";
import { formatAmount, type Currency } from "./impl";

describe("formatAmount", () => {
  it("uses the right number of decimals for each currency", () => {
    const rows: Array<[number, Currency, string]> = [
      [1999, "USD", "19.99 USD"],
      [500, "USD", "5.00 USD"],
      [123456, "EUR", "1234.56 EUR"],
      [0, "EUR", "0.00 EUR"],
    ];

    for (const [minor, currency, expected] of rows) {
      expect(formatAmount(minor, currency)).toBe(expected);
    }
  });
});
