import { describe, expect, test } from "vitest";
import { nextDelayMs, type Delivery } from "./impl";

describe("nextDelayMs", () => {
  test("clamps the exponential backoff at one hour", () => {
    const endpoint = {
      id: "wh_end_12",
      url: "https://hooks.partner.example/stardeck",
      secret: "whsec_2f8ac1",
      subscribedEvents: ["order.created", "order.refunded", "invoice.paid", "invoice.failed"],
      disabledAt: null,
      createdAt: "2023-11-02T07:00:00.000Z",
    };
    const history: Delivery[] = Array.from({ length: 22 }, (_, i) => ({
      id: `dlv_${i}`,
      attempt: (i % 6) + 1,
      status: i % 6 === 5 ? "delivered" : "failed",
    }));
    const responses = history.map((delivery) => ({
      deliveryId: delivery.id,
      statusCode: delivery.status === "delivered" ? 200 : 503,
      durationMs: 120 + (Number(delivery.id.split("_")[1]) % 7) * 30,
      responseBody: delivery.status === "delivered" ? "ok" : "upstream unavailable",
    }));
    const signatureHeaders = history.map((delivery) => ({
      deliveryId: delivery.id,
      header: `t=1700000000,v1=${delivery.id}`,
    }));

    expect(nextDelayMs(history.length, 0)).toBe(3_600_000);
  });
});
