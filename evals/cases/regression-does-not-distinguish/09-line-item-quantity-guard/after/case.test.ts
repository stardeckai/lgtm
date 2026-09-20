import { describe, expect, it } from "vitest";
import { orderTotalCents } from "./impl";

describe("orderTotalCents", () => {
  it("refuses a line with a quantity below one", () => {
    expect(orderTotalCents([{ sku: "A", quantity: 2, unitCents: 1500 }])).toBe(3000);
    expect(orderTotalCents([{ sku: "A", quantity: 1, unitCents: 1500 }, { sku: "B", quantity: 3, unitCents: 100 }])).toBe(1800);
  });
});
