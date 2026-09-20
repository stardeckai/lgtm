import { describe, expect, it, vi } from "vitest";
import { ledgerEntriesFor, type EventSource } from "./impl";

const source: EventSource = {
  fetch: vi.fn().mockResolvedValue({
    type: "charge.succeeded",
    data: { id: "ch_7A", amount: 12_500, application_fee_amount: 388 },
  }),
};

describe("ledgerEntriesFor", () => {
  it("books cash net of the processor fee while crediting revenue gross", async () => {
    const entries = await ledgerEntriesFor(source, "evt_1");

    expect(entries).toEqual([
      { account: "cash", debitCents: 12_112, creditCents: 0, memo: "charge ch_7A" },
      { account: "processor_fees", debitCents: 388, creditCents: 0, memo: "charge ch_7A" },
      { account: "revenue", debitCents: 0, creditCents: 12_500, memo: "charge ch_7A" },
    ]);
    expect(entries.reduce((sum, e) => sum + e.debitCents - e.creditCents, 0)).toBe(0);
  });
});
