export function allocateCents(totalCents: number, shares: number[]): number[] {
  const weight = shares.reduce((sum, share) => sum + share, 0);
  if (weight <= 0) throw new Error("shares must sum to a positive weight");
  const raw = shares.map((share) => (totalCents * share) / weight);
  const floors = raw.map((value) => Math.floor(value));
  let remainder = totalCents - floors.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  const out = [...floors];
  for (const entry of order) {
    if (remainder <= 0) break;
    out[entry.index] = out[entry.index]! + 1;
    remainder -= 1;
  }
  return out;
}
