import { beforeEach, describe, expect, it } from "vitest";
import { availableUnits, InventoryStore } from "./impl";

const store = new InventoryStore();

beforeEach(() => {
  store.levels.clear();
  store.levels.set("kbd-01", { sku: "kbd-01", onHand: 4, reserved: 9 });
});

describe("availableUnits", () => {
  it("reports nothing available when reservations have eaten the stock", () => {
    expect(availableUnits(store, "kbd-01")).toBe(0);
  });
});
