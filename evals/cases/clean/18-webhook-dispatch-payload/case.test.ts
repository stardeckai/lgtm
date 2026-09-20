import { describe, expect, it, vi } from "vitest";
import { dispatch, type DomainEvent, type Subscription } from "./impl";

describe("dispatch", () => {
  it("posts the agreed json body only to endpoints subscribed to that event type", async () => {
    const post = vi.fn(async () => ({ status: 200 }));
    const subscriptions: Subscription[] = [
      { id: "sub_1", url: "https://a.example.com/hook", events: ["invoice.paid"], secret: "s1" },
      { id: "sub_2", url: "https://b.example.com/hook", events: ["invoice.voided"], secret: "s2" },
    ];
    const event: DomainEvent = { type: "invoice.paid", occurredAt: "2026-03-04T10:00:00Z", data: { id: "in_9", cents: 2500 } };

    const delivered = await dispatch(subscriptions, event, post);

    expect(delivered).toBe(1);
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(
      "https://a.example.com/hook",
      { "content-type": "application/json", "x-event-type": "invoice.paid" },
      '{"subscription_id":"sub_1","type":"invoice.paid","occurred_at":"2026-03-04T10:00:00Z","data":{"id":"in_9","cents":2500}}',
    );
  });
});
