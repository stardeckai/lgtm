import { getSession } from "./session";
import { db } from "./db";

export type CheckoutBody = { cartId: string; paymentMethodId: string };

export async function checkoutFlow(body: CheckoutBody): Promise<{ orderId: string; status: string }> {
  const session = await getSession();
  const cart = await db.cart(body.cartId);
  if (cart.ownerId !== session.userId) throw new Error("forbidden");

  const response = await fetch("https://psp.example.com/charges", {
    method: "POST",
    body: JSON.stringify({ amount: cart.totalCents, method: body.paymentMethodId }),
  });
  const charge = (await response.json()) as { id: string; status: string };
  const order = await db.createOrder({ cartId: cart.id, chargeId: charge.id, status: charge.status });
  return { orderId: order.id, status: order.status };
}
