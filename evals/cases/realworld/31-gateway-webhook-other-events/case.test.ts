import { describe, expect, it } from "vitest";
import { handleGatewayWebhook, InvoiceStore } from "./impl";

describe("handleGatewayWebhook", () => {
  it("ignores event types other than payment_link.paid", async () => {
    const store = new InvoiceStore();
    store.seed({ id: "inv-1", paymentLinkId: "lk1", paymentStatus: "open" });

    await expect(
      handleGatewayWebhook(store, { type: "charge.succeeded", payload: {} }),
    ).resolves.toBeUndefined();
  });
});
