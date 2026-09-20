import { describe, expect, it } from "vitest";
import { netPayoutCents } from "./impl";

describe("netPayoutCents", () => {
  it("takes the platform fee out of the gross amount", () => {
    expect(netPayoutCents({ sellerId: "s1", grossCents: 1055, feeRate: 0.029 })).toBe(1025);
    expect(netPayoutCents({ sellerId: "s1", grossCents: 10000, feeRate: 0.029 })).toBe(9710);
  });
});
