export type BasketItem = { sku: string; qty: number };
export type Basket = { id: string; items: BasketItem[] };

export function hasItems(basket: Basket): boolean {
  return basket.items.length > 0;
}

export function checkoutState(basket: Basket): "empty" | "ready" {
  return hasItems(basket) ? "ready" : "empty";
}
