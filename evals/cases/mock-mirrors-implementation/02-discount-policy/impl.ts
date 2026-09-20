export type Membership = "free" | "plus" | "pro";

export interface DiscountPolicy {
  percentFor(membership: Membership, monthsActive: number): number;
}

export const standardPolicy: DiscountPolicy = {
  percentFor(membership, monthsActive) {
    const base = membership === "pro" ? 15 : membership === "plus" ? 8 : 0;
    const loyalty = monthsActive >= 24 ? 5 : monthsActive >= 12 ? 2 : 0;
    return Math.min(base + loyalty, 18);
  },
};

export function renewalQuoteCents(
  policy: DiscountPolicy,
  listCents: number,
  membership: Membership,
  monthsActive: number,
): number {
  const percent = policy.percentFor(membership, monthsActive);
  return listCents - Math.round((listCents * percent) / 100);
}
