import { describe, expect, it, vi } from "vitest";
import { InvoiceStore, settleInvoice } from "./impl";

describe("settleInvoice", () => {
  it("stores the settlement timestamp once the charge is accepted", async () => {
    const store = new InvoiceStore();
    store.put({ id: "inv-9", cents: 1250, paidAt: null });
    const gateway = { charge: vi.fn().mockResolvedValue({ ok: true }) };

    await settleInvoice(store, gateway, () => new Date("2024-03-01T10:00:00.000Z"), "inv-9");

    expect(store.get("inv-9")).toEqual({
      id: "inv-9",
      cents: 1250,
      paidAt: "2024-03-01T10:00:00.000Z",
    });
    expect(gateway.charge).toHaveBeenCalledWith(1250);
  });
});
