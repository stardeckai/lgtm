import { describe, expect, it, vi } from "vitest";
import { deliverOrderEvent, type HttpClient } from "./impl";

describe("deliverOrderEvent", () => {
  it("posts the documented order.placed envelope to the subscriber", async () => {
    const http: HttpClient = { post: vi.fn().mockResolvedValue({ status: 200 }) };

    await deliverOrderEvent(
      http,
      { url: "https://hooks.example.com/orders", secret: "sig_123" },
      { orderId: "o-77", totalCents: 4500, currency: "thb", placedAt: "2024-06-01T09:00:00.000Z" },
    );

    expect(http.post).toHaveBeenCalledWith(
      "https://hooks.example.com/orders",
      {
        type: "order.placed",
        data: { id: "o-77", amount: 4500, currency: "THB" },
        created: "2024-06-01T09:00:00.000Z",
      },
      { "content-type": "application/json", "x-signature": "sig_123" },
    );
  });
});
