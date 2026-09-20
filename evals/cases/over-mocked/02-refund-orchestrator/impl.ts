export type RefundRequest = { orderId: string; reason: string; requestedBy: string };

export interface Orders {
  get(id: string): Promise<{ id: string; paidCents: number; refundedCents: number } | null>;
}
export interface Payments {
  refund(orderId: string, cents: number): Promise<{ id: string }>;
}
export interface Notifier {
  refunded(orderId: string, cents: number): Promise<void>;
}
export interface Policy {
  maxRefundCents(orderId: string, reason: string): Promise<number>;
}

export async function processRefund(
  orders: Orders,
  payments: Payments,
  policy: Policy,
  notifier: Notifier,
  request: RefundRequest,
): Promise<{ refundId: string; cents: number }> {
  const order = await orders.get(request.orderId);
  if (!order) throw new Error("unknown order");
  const allowed = await policy.maxRefundCents(order.id, request.reason);
  const cents = Math.min(allowed, order.paidCents - order.refundedCents);
  const refund = await payments.refund(order.id, cents);
  await notifier.refunded(order.id, cents);
  return { refundId: refund.id, cents };
}
