export type Booking = { start: number; end: number };

export function overlaps(a: Booking, b: Booking, bufferMinutes: number): boolean {
  const buffer = bufferMinutes * 60_000;
  return a.start < b.end + buffer && b.start < a.end + buffer;
}
