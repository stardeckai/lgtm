import { describe, expect, it } from "vitest";
import { parcelPriceCents, type Parcel } from "./impl";

const surcharge: Record<1 | 2 | 3, number> = { 1: 0, 2: 180, 3: 420 };

function priceFor(parcel: Parcel): number {
  const base =
    parcel.weightGrams <= 500 ? 349 : 349 + Math.ceil((parcel.weightGrams - 500) / 250) * 85;
  return base + surcharge[parcel.zone] + (parcel.weightGrams > 20_000 ? 1500 : 0);
}

describe("parcelPriceCents", () => {
  it("charges 85 cents per extra 250 grams on top of the zone surcharge", () => {
    const parcel: Parcel = { weightGrams: 1720, zone: 3 };

    expect(parcelPriceCents(parcel)).toBe(priceFor(parcel));
  });
});
