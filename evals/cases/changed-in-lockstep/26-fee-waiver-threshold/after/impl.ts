export type Ticketed = { faceValueCents: number; bookingFeeCents: number };

export function checkoutTotalCents(items: Ticketed[], waiveFeesOverCents = Number.POSITIVE_INFINITY): number {
  const face = items.reduce((sum, item) => sum + item.faceValueCents, 0);
  if (face >= waiveFeesOverCents) return face;
  return face + items.reduce((sum, item) => sum + item.bookingFeeCents, 0);
}
