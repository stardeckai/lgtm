import { describe, expect, test } from "vitest";
import { confirmationSubject, type Order } from "./impl";

describe("confirmationSubject", () => {
  test("uses the French subject line for a French delivery country", () => {
    const catalogue = [
      { sku: "CH-001", title: "Oak chair", unitCents: 12900, weightGrams: 6400, taxClass: "standard" },
      { sku: "TB-220", title: "Walnut table", unitCents: 48900, weightGrams: 31000, taxClass: "standard" },
      { sku: "LM-014", title: "Brass lamp", unitCents: 7400, weightGrams: 1900, taxClass: "standard" },
      { sku: "RG-008", title: "Wool rug", unitCents: 21900, weightGrams: 8800, taxClass: "reduced" },
    ];
    const shippingAddress = {
      name: "Camille Roy",
      line1: "12 Rue des Lilas",
      line2: "Appartement 4",
      city: "Lyon",
      postcode: "69003",
      country: "FR",
      phone: "+33 4 72 00 00 00",
    };
    const billingAddress = { ...shippingAddress, line2: undefined, name: "Roy SARL" };
    const promotions = [
      { code: "SPRING10", type: "percent", value: 10, appliesTo: ["CH-001", "TB-220"] },
      { code: "FREESHIP", type: "shipping", value: 0, appliesTo: [] },
    ];
    const loyalty = { tier: "gold", pointsBefore: 4820, pointsEarned: 910, multiplier: 1.5 };
    const shipment = {
      carrier: "colissimo",
      service: "48h",
      estimatedDays: 2,
      weightGrams: catalogue.reduce((sum, item) => sum + item.weightGrams, 0),
      trackingNumber: "6A1123456789",
    };
    const order: Order = {
      id: "ord_7781",
      currency: "EUR",
      countryCode: shippingAddress.country,
      lines: catalogue.map((item) => ({ sku: item.sku, qty: 1, unitCents: item.unitCents })),
    };
    const payment = { provider: "stripe", intentId: "pi_3Nabc", status: "succeeded", brand: "visa", last4: "4242" };

    expect(confirmationSubject(order)).toBe("Votre commande est confirmee (ord_7781)");
  });
});
