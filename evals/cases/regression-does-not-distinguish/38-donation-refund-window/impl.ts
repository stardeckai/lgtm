export type Donation = {
  id: string;
  cents: number;
  madeAt: number;
  refunded: boolean;
};

const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function refund(donation: Donation, nowMs: number): Donation {
  if (donation.refunded) throw new Error("already refunded");
  if (nowMs - donation.madeAt > WINDOW_MS)
    throw new Error("refund window closed");
  return { ...donation, refunded: true };
}
