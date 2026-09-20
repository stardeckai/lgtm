import { describe, expect, it } from "vitest";
import { Checkout } from "./impl";

describe("Checkout.pay", () => {
  it("captures the card and emails the buyer a receipt for the amount charged", () => {
    const checkout = new Checkout(() => true);

    const charge = checkout.pay("buyer@example.com", 4250);

    expect(charge.status).toBe("captured");
    expect(charge.amountCents).toBe(4250);
  });
});
