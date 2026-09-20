export type Fill = { odometerKm: number; litres: number };

export function totalLitres(fills: Fill[]): number {
  return fills.reduce((sum, f) => sum + f.litres, 0);
}
