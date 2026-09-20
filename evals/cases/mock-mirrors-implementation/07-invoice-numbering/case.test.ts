import { describe, expect, it } from "vitest";
import { issueInvoice, type Draft, type SequenceSource } from "./impl";

const counters = new Map<string, number>();
const source: SequenceSource = {
  next(prefix, year) {
    const key = `${prefix}-${year}`;
    const value = (counters.get(key) ?? 0) + 1;
    counters.set(key, value);
    return `${prefix}-${year}-${String(value).padStart(5, "0")}`;
  },
};

const draft: Draft = { orgPrefix: "ACME", issuedAt: "2025-02-14T00:00:00.000Z", totalCents: 42_000 };

describe("issueInvoice", () => {
  it("numbers consecutive invoices without gaps inside the issuing year", () => {
    expect(issueInvoice(source, draft).number).toBe("ACME-2025-00001");
    expect(issueInvoice(source, draft).number).toBe("ACME-2025-00002");
  });
});
