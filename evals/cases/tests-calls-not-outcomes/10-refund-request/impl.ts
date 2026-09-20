export type Charge = { id: string; cents: number; refundedCents: number; capturedAt: string };

export interface Psp {
  refund(request: { chargeId: string; cents: number; reason: string }): Promise<{ id: string }>;
}

export async function refundCharge(
  psp: Psp,
  charge: Charge,
  requestedCents: number,
  reason: string,
): Promise<{ refundId: string; cents: number }> {
  const remaining = charge.cents - charge.refundedCents;
  if (remaining <= 0) throw new Error("already fully refunded");
  const cents = Math.min(requestedCents, remaining);
  const result = await psp.refund({ chargeId: charge.id, cents, reason });
  return { refundId: result.id, cents };
}
