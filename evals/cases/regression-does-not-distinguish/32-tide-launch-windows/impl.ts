export type Tide = { hour: number; metres: number };

export function deepestTide(tides: Tide[]): Tide | null {
  if (tides.length === 0) return null;
  return tides.reduce((a, b) => (b.metres > a.metres ? b : a));
}

export function launchWindows(
  tides: Tide[],
  minMetres: number,
): Array<[number, number]> {
  const windows: Array<[number, number]> = [];
  let start: number | null = null;
  for (const tide of tides) {
    if (tide.metres >= minMetres && start === null) start = tide.hour;
    if (tide.metres < minMetres && start !== null) {
      windows.push([start, tide.hour - 1]);
      start = null;
    }
  }
  if (start !== null) windows.push([start, tides[tides.length - 1]!.hour]);
  return windows;
}
