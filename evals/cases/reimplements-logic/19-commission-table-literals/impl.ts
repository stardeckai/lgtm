export type Tier = { minUnits: number; centsPerUnit: number };

export const TIERS: Tier[] = [
  { minUnits: 0, centsPerUnit: 40 },
  { minUnits: 100, centsPerUnit: 32 },
  { minUnits: 500, centsPerUnit: 25 },
];

export function metredChargeCents(units: number): number {
  let remaining = units;
  let total = 0;
  for (let i = TIERS.length - 1; i >= 0; i -= 1) {
    const tier = TIERS[i]!;
    if (remaining > tier.minUnits) {
      const inTier = remaining - tier.minUnits;
      total += inTier * tier.centsPerUnit;
      remaining = tier.minUnits;
    }
  }
  return total;
}
