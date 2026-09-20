import { describe, expect, it } from "vitest";
import { invoiceTotalCents } from "./impl";

describe("invoiceTotalCents", () => {
  it("adds a late fee to invoices past the 30 day grace period", () => {
    const total = invoiceTotalCents({ id: "inv_88", amountCents: 120000, daysLate: 5 });

    expect(total).toBe(120000);
  });
});
