import { describe, expect, it } from "vitest";
import { availableUnits, type StockRow } from "./impl";

describe("availableUnits", () => {
  it("subtracts reserved units from the on-hand count", () => {
    const warehouses = [
      { id: "wh_ams", name: "Amsterdam", timezone: "Europe/Amsterdam", cutoffHour: 16, zones: ["A", "B", "C"] },
      { id: "wh_mad", name: "Madrid", timezone: "Europe/Madrid", cutoffHour: 15, zones: ["A", "B"] },
      { id: "wh_war", name: "Warsaw", timezone: "Europe/Warsaw", cutoffHour: 14, zones: ["A"] },
    ];
    const carriers = warehouses.map((w) => ({
      warehouseId: w.id,
      primary: "dhl",
      fallback: "gls",
      pickupWindows: [`${w.cutoffHour - 2}:00`, `${w.cutoffHour}:00`],
    }));
    const skus = ["KB-01", "MS-02", "HP-03", "DK-04", "CB-05"];
    const rows: StockRow[] = [];
    for (const warehouse of warehouses) {
      for (const [index, sku] of skus.entries()) {
        rows.push({ sku, warehouseId: warehouse.id, onHand: 10 * (index + 1), reserved: index });
      }
    }
    const inboundShipments = warehouses.flatMap((w) =>
      skus.map((sku) => ({ warehouseId: w.id, sku, qty: 25, eta: "2024-06-01T08:00:00.000Z" })),
    );
    const cycleCounts = rows.map((r) => ({ ...r, countedAt: "2024-05-20T00:00:00.000Z", variance: 0 }));

    expect(availableUnits(rows, "HP-03", "wh_mad")).toBe(28);
  });
});
