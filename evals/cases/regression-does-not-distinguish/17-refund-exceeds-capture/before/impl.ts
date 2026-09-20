export type Charge = { id: string; capturedCents: number; refundedCents: number };

export function applyRefund(charge: Charge, amountCents: number): Charge {
  if (amountCents <= 0) throw new RangeError("refund must be positive");
  return { ...charge, refundedCents: charge.refundedCents + amountCents };
}
