import { describe, expect, it } from "vitest";
import { buildCanonicalQrPayload, CANONICAL_QR_PATTERN, TicketStore } from "./impl";

describe("ticket QR payload contract", () => {
  it("persists the canonical QR payload when a ticket settles", () => {
    const store = new TicketStore();
    const ticketId = "11111111-2222-4333-8444-555555555555";
    store.create(ticketId, "ab12cd");

    store.settle(ticketId);

    const row = store.get(ticketId)!;
    expect(row.qrPayload).toBeTruthy();
    const payload = row.qrPayload!;
    expect(payload).toBe(buildCanonicalQrPayload(row.id, row.ticketCode));
    expect(CANONICAL_QR_PATTERN.test(payload)).toBe(true);
  });
});
