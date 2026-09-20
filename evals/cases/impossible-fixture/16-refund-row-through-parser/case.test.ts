import { describe, expect, it } from "vitest";
import { outstandingRefundCents, parseRefundRow } from "./impl";

describe("outstandingRefundCents", () => {
  it("counts only the refunds that have not settled yet", () => {
    const rows = [
      { id: "re_1", chargeId: "ch_1", amountCents: 2500, status: "pending" },
      { id: "re_2", chargeId: "ch_1", amountCents: 1000, status: "settled" },
      { id: "re_3", chargeId: "ch_2", amountCents: 750, status: "pending" },
    ].map(parseRefundRow);

    expect(outstandingRefundCents(rows)).toBe(3250);
  });
});
