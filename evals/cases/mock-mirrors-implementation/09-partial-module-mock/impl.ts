export type Cart = { items: Array<{ sku: string; qty: number; unitCents: number }>; country: string };

export function shippingCents(cart: Cart): number {
  const units = cart.items.reduce((sum, item) => sum + item.qty, 0);
  const base = cart.country === "US" ? 495 : 1195;
  return units <= 2 ? base : base + (units - 2) * 120;
}

export function subtotalCents(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.qty * item.unitCents, 0);
}

export function checkoutTotalCents(cart: Cart, creditCents: number): number {
  const goods = subtotalCents(cart);
  const shipping = goods >= 5000 ? 0 : shippingCents(cart);
  return Math.max(0, goods + shipping - creditCents);
}
