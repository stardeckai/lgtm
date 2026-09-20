import { describe, expect, it } from "vitest";
import { allocate, Inventory } from "./impl";

describe("allocate", () => {
  it("draws from the fullest location first and puts everything back when it cannot finish", () => {
    const inventory = new Inventory([
      { code: "AMS", available: 4 },
      { code: "BER", available: 9 },
    ]);

    expect(allocate(inventory, 11)).toEqual([
      { code: "BER", units: 9 },
      { code: "AMS", units: 2 },
    ]);
    expect(inventory.snapshot()).toEqual({ AMS: 2, BER: 0 });

    expect(() => allocate(inventory, 5)).toThrow(/short by 3 units/);
    expect(inventory.snapshot()).toEqual({ AMS: 2, BER: 0 });
  });
});
