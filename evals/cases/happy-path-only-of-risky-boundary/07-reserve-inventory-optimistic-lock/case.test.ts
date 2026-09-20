import { describe, expect, it } from "vitest";
import { StockTable } from "./impl";

describe("StockTable.reserve", () => {
  it("takes the units off the shelf and bumps the version", () => {
    const table = new StockTable();
    table.put({ sku: "lamp-7", available: 10, version: 3 });

    expect(table.reserve("lamp-7", 4, 3)).toEqual({ sku: "lamp-7", available: 6, version: 4 });
    expect(table.read("lamp-7").available).toBe(6);
  });

  it("allows reserving the whole remaining quantity", () => {
    const table = new StockTable();
    table.put({ sku: "lamp-7", available: 2, version: 0 });

    expect(table.reserve("lamp-7", 2, 0).available).toBe(0);
  });

  it("reserves twice in a row when the caller reads the new version", () => {
    const table = new StockTable();
    table.put({ sku: "lamp-7", available: 5, version: 1 });

    const first = table.reserve("lamp-7", 1, 1);

    expect(table.reserve("lamp-7", 1, first.version).available).toBe(3);
  });
});
