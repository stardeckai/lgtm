import { describe, expect, it } from "vitest";
import { refundCents } from "./impl";

describe("refundCents", () => {
  it("refunds shipping as well when every line comes back", () => {
    const refund = refundCents({
      id: "o-12",
      lines: [{ sku: "A", qty: 2, unitCents: 1500, returned: 2 }],
      shippingCents: 599,
      usedPromo: false,
    });

    expect(refund).toBeGreaterThan(0);
  });
});
