export type Basket = { code: string; subtotalCents: number; memberTier: "basic" | "gold" };

export type Priced = { code: string; subtotalCents: number; discountCents: number; totalCents: number };

const PERCENT_BY_CODE: Record<string, number> = { SAVE10: 10, SAVE25: 25, HALF: 50 };

export function priceBasket(basket: Basket): Priced {
  const percent = PERCENT_BY_CODE[basket.code] ?? 0;
  const bonus = basket.memberTier === "gold" ? 5 : 0;
  const capped = Math.min(percent + bonus, 50);
  const discountCents = Math.round((basket.subtotalCents * capped) / 100);
  return {
    code: basket.code,
    subtotalCents: basket.subtotalCents,
    discountCents,
    totalCents: basket.subtotalCents - discountCents,
  };
}
