export type Bracket = { upToCents: number | null; rate: number };

export const BRACKETS: Bracket[] = [
  { upToCents: 15_000_00, rate: 0 },
  { upToCents: 30_000_00, rate: 0.05 },
  { upToCents: 50_000_00, rate: 0.1 },
  { upToCents: null, rate: 0.15 },
];

export function annualTaxCents(incomeCents: number): number {
  let remaining = incomeCents;
  let previousCeiling = 0;
  let tax = 0;
  for (const bracket of BRACKETS) {
    if (remaining <= 0) break;
    const ceiling = bracket.upToCents ?? Number.POSITIVE_INFINITY;
    const span = Math.min(remaining, ceiling - previousCeiling);
    tax += span * bracket.rate;
    remaining -= span;
    previousCeiling = ceiling;
  }
  return Math.round(tax);
}
