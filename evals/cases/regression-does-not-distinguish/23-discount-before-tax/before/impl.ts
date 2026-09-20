export type Order = { subtotalCents: number; discountCents: number; taxRate: number };

export function totalCents(order: Order): number {
  const taxed = Math.round(order.subtotalCents * (1 + order.taxRate));
  return Math.max(0, taxed - order.discountCents);
}
