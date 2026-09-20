export type Cart = {
  id: string;
  items: { sku: string; qty: number; unitCents: number }[];
  couponCode: string | null;
};

export interface Analytics {
  track(event: string, properties: Record<string, unknown>): void;
}

export function trackCheckoutCompleted(analytics: Analytics, cart: Cart, paidCents: number): void {
  analytics.track("checkout_completed", {
    cart_id: cart.id,
    item_count: cart.items.reduce((n, i) => n + i.qty, 0),
    revenue_cents: paidCents,
    coupon_used: cart.couponCode !== null,
  });
}
