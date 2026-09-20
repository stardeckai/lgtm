import { describe, expect, it, vi } from "vitest";
import { sendConfirmation, type Mailer } from "./impl";

describe("sendConfirmation", () => {
  it("writes the formatted total and the slower delivery estimate into the email", async () => {
    const mailer: Mailer = { send: vi.fn().mockResolvedValue(undefined) };

    await sendConfirmation(mailer, {
      id: "o-12",
      customerEmail: "buyer@example.com",
      totalCents: 129_900,
      etaDays: 5,
    });

    expect(mailer.send).toHaveBeenCalledWith(
      "buyer@example.com",
      "Order o-12 confirmed",
      "Total: ฿1299.00\nArriving in about 5 days",
    );
  });
});
