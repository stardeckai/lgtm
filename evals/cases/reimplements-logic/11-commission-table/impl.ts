export type Deal = { id: string; valueCents: number; isRenewal: boolean };

export function commissionCents(deal: Deal, quotaAttainment: number): number {
  const rate = quotaAttainment >= 1 ? 0.12 : quotaAttainment >= 0.8 ? 0.09 : 0.06;
  const adjusted = deal.isRenewal ? rate * 0.5 : rate;
  return Math.round(deal.valueCents * adjusted);
}
