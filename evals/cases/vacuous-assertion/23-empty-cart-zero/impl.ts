export type Line = { sku: string; qty: number; unitCents: number };

export type Cart = { lines: Line[]; shippingCents: number; freeShippingThresholdCents: number };

export function payableCents(cart: Cart): number {
  const goods = cart.lines.reduce((sum, line) => sum + line.qty * line.unitCents, 0);
  if (goods === 0) return 0;
  const shipping = goods >= cart.freeShippingThresholdCents ? 0 : cart.shippingCents;
  return goods + shipping;
}
