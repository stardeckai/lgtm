export function allocate(totalCents: number, weights: number[]): number[] {
  if (weights.length === 0) return [];
  if (weights.some((w) => w < 0)) throw new RangeError("weights must not be negative");
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  if (totalWeight === 0) throw new RangeError("weights must not all be zero");
  const shares = weights.map((w) => Math.floor((totalCents * w) / totalWeight));
  let remainder = totalCents - shares.reduce((sum, s) => sum + s, 0);
  const order = weights
    .map((w, index) => ({ index, fraction: (totalCents * w) / totalWeight - Math.floor((totalCents * w) / totalWeight) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (const entry of order) {
    if (remainder === 0) break;
    shares[entry.index] = shares[entry.index]! + 1;
    remainder -= 1;
  }
  return shares;
}
