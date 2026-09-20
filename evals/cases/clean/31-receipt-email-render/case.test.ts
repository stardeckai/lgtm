import { describe, expect, it, vi } from "vitest";
import { sendReceipt, type Receipt } from "./impl";

describe("sendReceipt", () => {
  it("hands the transport a body whose total is the sum of the printed lines", async () => {
    const send = vi.fn(async () => ({ id: "msg_1" }));
    const receipt: Receipt = {
      orderId: "ord_7",
      customerName: "Ada",
      currency: "EUR",
      lines: [
        { label: "Subscription", cents: 1999 },
        { label: "Seats", cents: 500 },
      ],
    };

    const id = await sendReceipt({ send }, "ada@example.com", receipt);

    expect(id).toBe("msg_1");
    expect(send).toHaveBeenCalledWith({
      to: "ada@example.com",
      subject: "Receipt for order ord_7",
      text: "Hi Ada,\n\nSubscription: 19.99 EUR\nSeats: 5.00 EUR\n\nTotal: 24.99 EUR\n",
    });
  });
});
