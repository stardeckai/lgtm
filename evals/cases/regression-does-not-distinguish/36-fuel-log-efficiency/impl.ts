export type Fill = { odometerKm: number; litres: number };

export function totalLitres(fills: Fill[]): number {
  return fills.reduce((sum, f) => sum + f.litres, 0);
}

export function litresPerHundredKm(fills: Fill[]): number | null {
  if (fills.length < 2) return null;
  const distance = fills[fills.length - 1]!.odometerKm - fills[0]!.odometerKm;
  if (distance <= 0) return null;
  const burnt = fills.slice(1).reduce((sum, f) => sum + f.litres, 0);
  return Math.round((burnt / distance) * 1000) / 10;
}
