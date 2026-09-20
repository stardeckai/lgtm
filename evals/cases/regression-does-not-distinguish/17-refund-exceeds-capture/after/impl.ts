export type Charge = { id: string; capturedCents: number; refundedCents: number };

export function applyRefund(charge: Charge, amountCents: number): Charge {
  if (amountCents <= 0) throw new RangeError("refund must be positive");
  const total = charge.refundedCents + amountCents;
  if (total > charge.capturedCents) throw new RangeError("refund exceeds captured amount");
  return { ...charge, refundedCents: total };
}
