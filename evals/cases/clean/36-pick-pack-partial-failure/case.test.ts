import { describe, expect, it } from "vitest";
import { pack, pick, type Bin, type OrderLine } from "./impl";

describe("pick and pack", () => {
  it("ships what it could pick, reports the shortfall and boxes each fragile item alone", () => {
    const bins: Bin[] = [
      { sku: "mug", onHand: 1, fragile: true },
      { sku: "shirt", onHand: 5, fragile: false },
      { sku: "vase", onHand: 0, fragile: true },
    ];
    const lines: OrderLine[] = [
      { sku: "mug", quantity: 2 },
      { sku: "shirt", quantity: 2 },
      { sku: "vase", quantity: 1 },
    ];

    const { picked, shortages } = pick(bins, lines);

    expect(picked).toEqual([{ sku: "mug", quantity: 1 }, { sku: "shirt", quantity: 2 }]);
    expect(shortages).toEqual([{ sku: "mug", quantity: 1 }, { sku: "vase", quantity: 1 }]);
    expect(pack(bins, picked)).toEqual([
      { box: "standard", lines: [{ sku: "shirt", quantity: 2 }] },
      { box: "padded-mug", lines: [{ sku: "mug", quantity: 1 }] },
    ]);
    expect(bins.find((b) => b.sku === "mug")?.onHand).toBe(0);
  });
});
