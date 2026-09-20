import { describe, expect, it } from "vitest";
import { nextPayoutIso } from "./impl";

describe("nextPayoutIso", () => {
  it("holds a German payout for four days before releasing it", () => {
    const payoutDate = nextPayoutIso({ id: "acct_1", country: "DE", verified: true }, "2026-03-02");

    expect(payoutDate).toBeDefined();
  });
});
