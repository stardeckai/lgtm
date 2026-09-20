export type Booking = { start: number; end: number };
export type OverlapOptions = { bufferMinutes: number };

export function overlaps(a: Booking, b: Booking, options: OverlapOptions): boolean {
  const buffer = options.bufferMinutes * 60_000;
  return a.start < b.end + buffer && b.start < a.end + buffer;
}
