import { describe, expect, it } from "vitest";
import { formatMoney } from "./impl";

describe("formatMoney", () => {
  it("groups thousands, honours minor units and puts the sign before the currency", () => {
    expect(formatMoney(1234567, "USD")).toBe("USD 12,345.67");
    expect(formatMoney(-50, "USD")).toBe("-USD 0.50");
    expect(formatMoney(1234567, "JPY")).toBe("JPY 1,234,567");
    expect(formatMoney(1234567, "BHD")).toBe("BHD 1,234.567");
  });
});
