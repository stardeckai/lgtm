export type OrderEvent = { orderId: string; totalCents: number; currency: string; placedAt: string };

export interface HttpClient {
  post(url: string, body: unknown, headers: Record<string, string>): Promise<{ status: number }>;
}

export type Subscription = { url: string; secret: string };

export async function deliverOrderEvent(
  http: HttpClient,
  subscription: Subscription,
  event: OrderEvent,
): Promise<number> {
  const body = {
    type: "order.placed",
    data: {
      id: event.orderId,
      amount: event.totalCents,
      currency: event.currency.toUpperCase(),
    },
    created: event.placedAt,
  };
  const response = await http.post(subscription.url, body, {
    "content-type": "application/json",
    "x-signature": subscription.secret,
  });
  return response.status;
}
