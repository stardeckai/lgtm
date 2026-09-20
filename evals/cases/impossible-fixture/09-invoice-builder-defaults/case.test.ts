import { describe, expect, it } from "vitest";
import { invoiceTotalCents, type Invoice } from "./impl";

const baseInvoice = { id: "inv_100", customerId: "cus_7", lines: [], discountCents: 0 };

function makeInvoice(overrides: Partial<Invoice>): Invoice {
  return { ...baseInvoice, ...overrides } as Invoice;
}

describe("invoiceTotalCents", () => {
  it("never returns a negative total when the discount is large", () => {
    const invoice = makeInvoice({ discountCents: 5000 });

    expect(invoiceTotalCents(invoice)).toBe(0);
  });
});
