import { describe, expect, it } from "vitest";
import { reorderPoint, type StockItem } from "./impl";

describe("reorderPoint", () => {
  it("covers lead-time demand plus safety stock", () => {
    const item: StockItem = { sku: "BRK-4", dailySales: 12.5, leadTimeDays: 9, onHand: 200 };
    const serviceFactor = 1.65;

    const expected =
      Math.ceil(item.dailySales * item.leadTimeDays) +
      Math.ceil(Math.sqrt(item.leadTimeDays) * item.dailySales * serviceFactor);

    expect(reorderPoint(item, serviceFactor)).toBe(expected);
  });
});
