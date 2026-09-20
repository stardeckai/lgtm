export type Tide = { hour: number; metres: number };

export function deepestTide(tides: Tide[]): Tide | null {
  if (tides.length === 0) return null;
  return tides.reduce((a, b) => (b.metres > a.metres ? b : a));
}
