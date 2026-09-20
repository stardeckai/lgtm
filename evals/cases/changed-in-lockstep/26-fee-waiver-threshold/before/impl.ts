export type Ticketed = { faceValueCents: number; bookingFeeCents: number };

export function checkoutTotalCents(items: Ticketed[]): number {
  return items.reduce((sum, item) => sum + item.faceValueCents + item.bookingFeeCents, 0);
}
