export type Parcel = { weightGrams: number; zone: 1 | 2 | 3 };

const ZONE_SURCHARGE_CENTS: Record<1 | 2 | 3, number> = { 1: 0, 2: 180, 3: 420 };

export function parcelPriceCents(parcel: Parcel): number {
  const base = parcel.weightGrams <= 500 ? 349 : 349 + Math.ceil((parcel.weightGrams - 500) / 250) * 85;
  const surcharge = ZONE_SURCHARGE_CENTS[parcel.zone];
  const heavy = parcel.weightGrams > 20_000 ? 1500 : 0;
  return base + surcharge + heavy;
}
