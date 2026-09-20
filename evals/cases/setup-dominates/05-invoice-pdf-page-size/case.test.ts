import { describe, expect, it } from "vitest";
import { pdfOptionsFor } from "./impl";

describe("pdfOptionsFor", () => {
  it("renders United States invoices on letter paper", () => {
    const seller = {
      legalName: "Bright Analytics Inc",
      taxId: "98-7654321",
      registeredAddress: { line1: "440 Market St", city: "San Francisco", state: "CA", zip: "94111", country: "US" },
      bank: { name: "First Republic", iban: null, routing: "121000248", account: "0099887766" },
      logoUrl: "https://cdn.example/logo-bright.png",
    };
    const buyer = {
      legalName: "Harbor Logistics LLC",
      taxId: "12-3456789",
      billingAddress: { line1: "1 Dock Way", city: "Seattle", state: "WA", zip: "98101", country: "US" },
      contact: { name: "Dale Voss", email: "ap@harbor.example" },
      paymentTermsDays: 30,
    };
    const invoice = {
      number: "INV-2024-0417",
      issuedAt: "2024-04-17",
      dueAt: "2024-05-17",
      currency: "USD",
      lines: [
        { description: "Platform subscription", qty: 1, unitCents: 249000, taxPercent: 0 },
        { description: "Onboarding services", qty: 12, unitCents: 18000, taxPercent: 0 },
        { description: "Additional seats", qty: 35, unitCents: 4900, taxPercent: 0 },
      ],
      notes: "Remit by ACH. Late payments accrue 1.5% monthly.",
    };
    const totals = {
      subtotalCents: invoice.lines.reduce((sum, l) => sum + l.qty * l.unitCents, 0),
      taxCents: 0,
      dueCents: invoice.lines.reduce((sum, l) => sum + l.qty * l.unitCents, 0),
    };

    expect(pdfOptionsFor(buyer.billingAddress.country).pageSize).toBe("LETTER");
  });
});
