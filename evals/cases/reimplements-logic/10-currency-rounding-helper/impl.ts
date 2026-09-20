export function roundToMinorUnit(amount: number, minorUnitDigits: number): number {
  const factor = 10 ** minorUnitDigits;
  const scaled = amount * factor;
  const floor = Math.floor(scaled);
  const remainder = scaled - floor;
  if (remainder > 0.5) return (floor + 1) / factor;
  if (remainder < 0.5) return floor / factor;
  return (floor % 2 === 0 ? floor : floor + 1) / factor;
}

export type Split = { payeeId: string; shareBasisPoints: number };

export function payoutAmounts(totalAmount: number, splits: Split[], minorUnitDigits: number): number[] {
  return splits.map((split) =>
    roundToMinorUnit((totalAmount * split.shareBasisPoints) / 10_000, minorUnitDigits),
  );
}
