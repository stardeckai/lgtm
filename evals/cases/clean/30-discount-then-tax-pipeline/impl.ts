export type Basket = { items: Array<{ sku: string; cents: number }>; memberSince?: number };
export type Promotion = { code: string; kind: "percent" | "fixed"; amount: number; minSubtotalCents: number };

export function applyPromotion(subtotalCents: number, promotion: Promotion | null): { discountCents: number; applied: boolean } {
  if (!promotion || subtotalCents < promotion.minSubtotalCents) return { discountCents: 0, applied: false };
  const discount = promotion.kind === "percent"
    ? Math.round(subtotalCents * (promotion.amount / 100))
    : Math.min(promotion.amount, subtotalCents);
  return { discountCents: discount, applied: true };
}

export function taxCents(baseCents: number, ratePerMille: number): number {
  return Math.round((baseCents * ratePerMille) / 1000);
}

export function price(basket: Basket, promotion: Promotion | null, ratePerMille: number) {
  const subtotalCents = basket.items.reduce((sum, item) => sum + item.cents, 0);
  const { discountCents, applied } = applyPromotion(subtotalCents, promotion);
  const taxableCents = subtotalCents - discountCents;
  const tax = taxCents(taxableCents, ratePerMille);
  return { subtotalCents, discountCents, taxCents: tax, totalCents: taxableCents + tax, promotionApplied: applied };
}
