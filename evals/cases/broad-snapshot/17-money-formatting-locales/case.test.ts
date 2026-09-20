import { describe, expect, it } from "vitest";
import { formatMoney } from "./impl";

describe("formatMoney", () => {
  it("puts the minus sign before the symbol and groups thousands", () => {
    expect(formatMoney(-123_456_78, "USD")).toMatchInlineSnapshot(`"-$123,456.78"`);
    expect(formatMoney(0, "EUR")).toBe("€0.00");
    expect(formatMoney(199_900, "JPY")).toBe("¥1,999");
  });
});
