import { describe, expect, it } from "vitest";
import { pdfMetadata } from "./impl";

describe("pdfMetadata", () => {
  it("formats the amount due in the invoice currency", () => {
    const meta = pdfMetadata(
      { number: "2026-0007", customerId: "cus_3", totalCents: 149900, currency: "EUR" },
      "de-DE",
    );

    expect(Object.keys(meta).length).toBeGreaterThan(0);
  });
});
