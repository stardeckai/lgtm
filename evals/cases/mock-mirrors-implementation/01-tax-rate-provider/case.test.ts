import { describe, expect, it } from "vitest";
import { grossCents, type TaxRateProvider } from "./impl";

const provider: TaxRateProvider = {
  ratePercentFor(region, category) {
    if (category === "food") return region === "EU" ? 7 : 0;
    if (category === "digital") return region === "EU" ? 21 : 8;
    return region === "EU" ? 21 : 6;
  },
};

describe("grossCents", () => {
  it("applies the statutory rate for the region and category", () => {
    expect(grossCents(provider, { region: "EU", category: "digital", netCents: 10_000 })).toBe(12_100);
    expect(grossCents(provider, { region: "US", category: "food", netCents: 10_000 })).toBe(10_000);
  });
});
