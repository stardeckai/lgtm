import { describe, expect, it } from "vitest";
import { trialBalance, type JournalEntry } from "./impl";

describe("trialBalance", () => {
  it("sums each account across the posted entries", () => {
    const entries = [
      { id: "je_1", postings: [{ account: "cash", amountCents: 5000 }] },
      { id: "je_2", postings: [{ account: "revenue", amountCents: -3000 }] },
    ] as JournalEntry[];

    expect(trialBalance(entries)).toEqual(
      new Map([
        ["cash", 5000],
        ["revenue", -3000],
      ]),
    );
  });
});
