export type Donation = {
  id: string;
  cents: number;
  madeAt: number;
  refunded: boolean;
};

export function refund(donation: Donation, nowMs: number): Donation {
  if (donation.refunded) throw new Error("already refunded");
  return { ...donation, refunded: true };
}
