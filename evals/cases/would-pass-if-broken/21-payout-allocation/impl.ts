export type Share = { payeeId: string; basisPoints: number };

export function allocateCents(totalCents: number, shares: Share[]): Record<string, number> {
  const out: Record<string, number> = {};
  let assigned = 0;
  shares.forEach((share, index) => {
    if (index === shares.length - 1) {
      out[share.payeeId] = totalCents - assigned;
      return;
    }
    const part = Math.floor((totalCents * share.basisPoints) / 10000);
    out[share.payeeId] = part;
    assigned += part;
  });
  return out;
}
