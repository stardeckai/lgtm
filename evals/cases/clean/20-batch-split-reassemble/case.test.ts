import { describe, expect, it } from "vitest";
import { byteLength, reassemble, splitByBudget, type Item } from "./impl";

describe("splitByBudget", () => {
  it("keeps every batch inside the budget and loses no item or ordering", () => {
    const items: Item[] = Array.from({ length: 9 }, (_, i) => ({ id: `m${i}`, body: "x".repeat(10 + i) }));

    const batches = splitByBudget(items, 120);

    expect(batches.length).toBeGreaterThan(1);
    for (const batch of batches) {
      expect(batch.reduce((sum, item) => sum + byteLength(item), 0)).toBeLessThanOrEqual(120);
      expect(batch.length).toBeGreaterThan(0);
    }
    expect(reassemble(batches)).toEqual(items);
    expect(() => splitByBudget([{ id: "big", body: "y".repeat(500) }], 120)).toThrow(RangeError);
  });
});
