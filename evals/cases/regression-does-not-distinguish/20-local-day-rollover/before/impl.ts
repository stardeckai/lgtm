export function localDay(epochMs: number, utcOffsetMinutes: number): string {
  return new Date(epochMs).toISOString().slice(0, 10);
}

export function isSameLocalDay(a: number, b: number, utcOffsetMinutes: number): boolean {
  return localDay(a, utcOffsetMinutes) === localDay(b, utcOffsetMinutes);
}
