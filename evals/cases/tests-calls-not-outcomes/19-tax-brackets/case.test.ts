import { describe, expect, it } from "vitest";
import { annualTaxCents } from "./impl";

describe("annualTaxCents", () => {
  it("taxes each slice of income at its own bracket rate", () => {
    expect(annualTaxCents(15_000_00)).toBe(0);
    expect(annualTaxCents(15_000_01)).toBe(0);
    expect(annualTaxCents(30_000_00)).toBe(75_000);
    expect(annualTaxCents(60_000_00)).toBe(425_000);
  });
});
