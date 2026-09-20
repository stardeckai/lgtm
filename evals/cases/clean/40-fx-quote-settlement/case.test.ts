import { describe, expect, it } from "vitest";
import { quote, settle } from "./impl";

describe("settle", () => {
  it("credits the quoted amount less the fee and refuses to settle once the quote lapsed", () => {
    const issued = 1_700_000_000_000;
    const q = quote("EUR", "USD", 250_00, 1_082_500, issued);

    expect(q.quotedMinor).toBe(27063);
    expect(settle(q, issued + 30_000, 50)).toEqual({ creditedMinor: 26928, feeMinor: 135 });
    expect(settle(q, issued + 60_000, 50)).toEqual({ creditedMinor: 26928, feeMinor: 135 });
    expect(settle(q, issued + 60_001, 50)).toEqual({ error: "quote expired" });
  });
});
