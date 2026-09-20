import { describe, expect, it } from "vitest";
import { invoiceGrossCents, type InvoiceLine } from "./impl";

describe("invoiceGrossCents", () => {
  it("adds VAT to every line before summing the invoice", () => {
    const lines: InvoiceLine[] = [
      { description: "seat licence", quantity: 3, unitCents: 1999 },
      { description: "onboarding", quantity: 1, unitCents: 45000 },
    ];
    const rate = 21;

    const expected = lines.reduce((sum, line) => {
      const net = line.quantity * line.unitCents;
      return sum + net + Math.round((net * rate) / 100);
    }, 0);

    expect(invoiceGrossCents(lines, rate)).toBe(expected);
  });
});
