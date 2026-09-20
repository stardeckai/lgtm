import { describe, expect, it } from "vitest";
import { buildQuoteModel, type QuoteLine } from "./impl";

describe("buildQuoteModel", () => {
  it("applies the twelve percent band at fifty units", () => {
    const lines: QuoteLine[] = [
      { sku: "LIC-STD", description: "Standard licence", qty: 50, listCents: 12_000 },
      { sku: "LIC-PRO", description: "Professional licence", qty: 9, listCents: 24_000 },
      { sku: "SUP-GLD", description: "Gold support", qty: 120, listCents: 3_000 },
    ];

    expect(buildQuoteModel("Q-2024-118", lines)).toMatchSnapshot();
  });
});
