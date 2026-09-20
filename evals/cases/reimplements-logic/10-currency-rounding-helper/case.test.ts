import { describe, expect, it } from "vitest";
import { payoutAmounts, roundToMinorUnit, type Split } from "./impl";

describe("payoutAmounts", () => {
  it("rounds each payee share to the currency minor unit", () => {
    const splits: Split[] = [
      { payeeId: "p-1", shareBasisPoints: 3333 },
      { payeeId: "p-2", shareBasisPoints: 3333 },
      { payeeId: "p-3", shareBasisPoints: 3334 },
    ];

    expect(payoutAmounts(410.25, splits, 2)).toEqual(
      splits.map((split) => roundToMinorUnit((410.25 * split.shareBasisPoints) / 10_000, 2)),
    );
  });
});
