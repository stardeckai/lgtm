import { describe, expect, it } from "vitest";
import { invoiceTotal } from "./impl";

describe("invoiceTotal", () => {
  it("converts every line into the invoice currency before summing them", () => {
    const total = invoiceTotal(
      [
        { amountMinor: 1000, currency: "EUR" },
        { amountMinor: 2500, currency: "EUR" },
      ],
      "EUR",
      { "USD:EUR": 0.92 },
    );

    expect(total).toEqual({ amountMinor: 3500, currency: "EUR" });
  });
});
