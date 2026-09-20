import { describe, expect, it, vi } from "vitest";
import { collect, Invoice, type Psp } from "./impl";

describe("collect", () => {
  it("keeps a part-paid invoice open and refuses to write it off once it is settled", async () => {
    const invoice = new Invoice("inv-1", 10_000);
    invoice.issue();
    const psp: Psp = {
      charge: vi
        .fn()
        .mockResolvedValueOnce({ captured: 4_000 })
        .mockResolvedValueOnce({ captured: 6_000 }),
    };

    expect(await collect(psp, invoice, 4_000)).toBe("open");
    expect(invoice.paidCents).toBe(4_000);

    expect(await collect(psp, invoice, 6_000)).toBe("paid");
    expect(() => invoice.writeOff()).toThrow("a paid invoice cannot be written off");
  });
});
