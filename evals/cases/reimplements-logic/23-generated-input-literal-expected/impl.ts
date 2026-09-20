export type Reading = { minute: number; celsius: number };

export function rollingAverage(readings: Reading[], windowSize: number): number[] {
  if (windowSize <= 0) throw new RangeError("windowSize must be positive");
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < readings.length; i += 1) {
    sum += readings[i]!.celsius;
    if (i >= windowSize) sum -= readings[i - windowSize]!.celsius;
    if (i >= windowSize - 1) out.push(Number((sum / windowSize).toFixed(2)));
  }
  return out;
}
