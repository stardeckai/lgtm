export type Cart = { id: string; totalCents: number; items: number; customerId: string };

export interface Gateway {
  charge(customerId: string, cents: number): Promise<{ id: string }>;
}

export class CheckoutError extends Error {
  constructor(public readonly code: "empty-cart" | "amount-too-large") {
    super(code);
  }
}

const MAX_CENTS = 500_000;

export async function checkout(gateway: Gateway, cart: Cart): Promise<string> {
  if (cart.items === 0) throw new CheckoutError("empty-cart");
  if (cart.totalCents > MAX_CENTS) throw new CheckoutError("amount-too-large");
  const charge = await gateway.charge(cart.customerId, cart.totalCents);
  return charge.id;
}
