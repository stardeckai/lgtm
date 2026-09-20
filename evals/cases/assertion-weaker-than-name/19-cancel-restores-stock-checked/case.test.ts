import { describe, expect, it } from "vitest";
import { Warehouse } from "./impl";

describe("Warehouse.cancel", () => {
  it("cancels the order, returns its units to stock, and does not double-credit a repeat cancel", () => {
    const warehouse = new Warehouse(
      new Map([
        ["o-1", { id: "o-1", status: "placed" as const, lines: [{ sku: "A", qty: 3 }] }],
      ]),
      new Map([["A", 7]]),
    );

    warehouse.cancel("o-1");
    expect(warehouse.orders.get("o-1")?.status).toBe("cancelled");
    expect(warehouse.stock.get("A")).toBe(10);

    warehouse.cancel("o-1");
    expect(warehouse.stock.get("A")).toBe(10);
  });
});
