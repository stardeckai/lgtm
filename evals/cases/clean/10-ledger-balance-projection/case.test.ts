import { describe, expect, it } from "vitest";
import { balances, Journal } from "./impl";

describe("balances", () => {
  it("projects posted lines into per-account balances that still net to zero", () => {
    const journal = new Journal();
    journal.post({ ref: "inv-1", entries: [{ account: "receivable", deltaMinor: 12000 }, { account: "revenue", deltaMinor: -12000 }] });
    journal.post({ ref: "pay-1", entries: [{ account: "cash", deltaMinor: 12000 }, { account: "receivable", deltaMinor: -12000 }] });

    expect(() => journal.post({ ref: "bad", entries: [{ account: "cash", deltaMinor: 1 }] })).toThrow(RangeError);
    expect(balances(journal)).toEqual({ receivable: 0, revenue: -12000, cash: 12000 });
  });
});
