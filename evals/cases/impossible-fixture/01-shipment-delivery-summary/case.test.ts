import { describe, expect, it } from "vitest";
import { deliverySummary, type Shipment } from "./impl";

describe("deliverySummary", () => {
  it("reports the transit time of a delivered shipment", () => {
    const shipment = {
      id: "shp_44",
      status: "delivered",
      shippedAt: null,
      deliveredAt: "2024-05-09T08:00:00.000Z",
    } as Shipment;

    expect(deliverySummary(shipment)).toBe("shp_44 arrived in 0 days");
  });
});
