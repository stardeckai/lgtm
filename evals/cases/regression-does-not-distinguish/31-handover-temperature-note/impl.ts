export type Reading = { at: string; celsius: number };

export function handoverNote(readings: Reading[]): string {
  if (readings.length === 0) return "no readings this shift";
  const highest = readings.reduce((a, b) => (b.celsius > a.celsius ? b : a));
  const lowest = readings.reduce((a, b) => (b.celsius < a.celsius ? b : a));
  return `${lowest.celsius}–${highest.celsius}°C, peak at ${highest.at}`;
}
