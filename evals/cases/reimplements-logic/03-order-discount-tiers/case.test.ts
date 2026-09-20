import { describe, expect, it } from "vitest";
import { payableCents, type Customer } from "./impl";

describe("payableCents", () => {
  it("stacks the loyalty tiers and the large-order bonus", () => {
    const customer: Customer = { id: "c-88", lifetimeCents: 2_600_000 };
    const orderCents = 62_000;

    let percent = 0;
    if (customer.lifetimeCents >= 500_000) percent += 5;
    if (customer.lifetimeCents >= 2_500_000) percent += 5;
    if (orderCents >= 50_000) percent += 3;
    percent = Math.min(percent, 12);

    expect(payableCents(customer, orderCents)).toBe(
      orderCents - Math.floor((orderCents * percent) / 100),
    );
  });
});
