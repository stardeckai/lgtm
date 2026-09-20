export type Subscription = { id: string; url: string; events: string[]; secret: string };
export type DomainEvent = { type: string; occurredAt: string; data: Record<string, unknown> };

export type HttpPost = (url: string, headers: Record<string, string>, body: string) => Promise<{ status: number }>;

export function buildBody(subscription: Subscription, event: DomainEvent): string {
  return JSON.stringify({
    subscription_id: subscription.id,
    type: event.type,
    occurred_at: event.occurredAt,
    data: event.data,
  });
}

export async function dispatch(
  subscriptions: Subscription[],
  event: DomainEvent,
  post: HttpPost,
): Promise<number> {
  let delivered = 0;
  for (const subscription of subscriptions) {
    if (!subscription.events.includes(event.type)) continue;
    const body = buildBody(subscription, event);
    const response = await post(subscription.url, { "content-type": "application/json", "x-event-type": event.type }, body);
    if (response.status < 300) delivered += 1;
  }
  return delivered;
}
