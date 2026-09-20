import { describe, expect, it } from "vitest";
import { discountCents } from "./impl";

describe("discountCents", () => {
  it("applies stacked offers in full up to half the subtotal and no further", () => {
    expect(discountCents(10_000, { percent: 20, stackedPercent: 10 })).toBe(3_000);
    expect(discountCents(10_000, { percent: 40, stackedPercent: 10 })).toBe(5_000);
    expect(discountCents(10_000, { percent: 40, stackedPercent: 30 })).toBe(5_000);
  });
});
