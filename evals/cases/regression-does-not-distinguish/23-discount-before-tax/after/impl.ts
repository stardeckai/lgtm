export type Order = { subtotalCents: number; discountCents: number; taxRate: number };

export function totalCents(order: Order): number {
  const discounted = Math.max(0, order.subtotalCents - order.discountCents);
  return Math.round(discounted * (1 + order.taxRate));
}
