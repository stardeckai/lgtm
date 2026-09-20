import { describe, expect, it } from "vitest";
import { planShipments } from "./impl";

describe("planShipments", () => {
  it("splits the order across warehouses when no single one can fulfil it", () => {
    const shipments = planShipments(
      [
        { sku: "A", qty: 2 },
        { sku: "B", qty: 1 },
      ],
      [
        { id: "wh-north", stock: { A: 10, B: 10 } },
        { id: "wh-south", stock: { A: 10, B: 10 } },
      ],
    );

    expect(shipments).toEqual([
      { warehouseId: "wh-north", lines: [{ sku: "A", qty: 2 }, { sku: "B", qty: 1 }] },
    ]);
  });
});
