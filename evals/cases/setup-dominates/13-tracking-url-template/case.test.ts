import { describe, expect, it } from "vitest";
import { trackingUrl, type Carrier } from "./impl";

describe("trackingUrl", () => {
  it("escapes a tracking number that contains a slash", () => {
    const carriers: Carrier[] = [
      { code: "dhl", name: "DHL Express", trackingTemplate: "https://track.dhl.example/{number}" },
      { code: "ups", name: "UPS", trackingTemplate: "https://track.ups.example/?n={number}" },
      { code: "gls", name: "GLS", trackingTemplate: "https://gls.example/parcel/{number}" },
    ];
    const shipment = {
      id: "shp_3301",
      orderId: "ord_9012",
      carrierCode: "ups",
      trackingNumber: "1Z999/AA1",
      packages: [
        { id: "pkg_1", weightGrams: 2400, dimensionsCm: [30, 20, 10], contents: ["SKU-1", "SKU-2"] },
        { id: "pkg_2", weightGrams: 900, dimensionsCm: [15, 15, 5], contents: ["SKU-3"] },
      ],
      events: [
        { at: "2024-04-01T08:00:00.000Z", code: "PICKED_UP", location: "Cologne" },
        { at: "2024-04-01T19:30:00.000Z", code: "IN_TRANSIT", location: "Duisburg" },
        { at: "2024-04-02T06:10:00.000Z", code: "OUT_FOR_DELIVERY", location: "Utrecht" },
      ],
      recipient: { name: "Sanne de Vries", city: "Utrecht", country: "NL", phone: "+31 6 1234 5678" },
      customsDeclaration: { valueCents: 18_900, currency: "EUR", hsCodes: ["8471.30", "8523.51"] },
    };

    expect(trackingUrl(carriers, shipment.carrierCode, shipment.trackingNumber)).toBe(
      "https://track.ups.example/?n=1Z999%2FAA1",
    );
  });
});
