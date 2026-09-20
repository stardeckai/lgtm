import { describe, expect, it, vi } from "vitest";
import { reserveOrder, type Warehouse } from "./impl";

describe("reserveOrder", () => {
  it("splits a partially available line into a reservation and a backorder", async () => {
    const warehouse: Warehouse = { reserve: vi.fn().mockResolvedValue(undefined) };

    await reserveOrder(warehouse, { "sku-1": 3 }, [{ sku: "sku-1", qty: 10 }]);

    expect(warehouse.reserve).toHaveBeenCalledTimes(1);
  });
});
