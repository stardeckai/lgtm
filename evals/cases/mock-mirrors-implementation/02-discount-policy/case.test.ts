import { describe, expect, it, vi } from "vitest";
import { renewalQuoteCents, type DiscountPolicy, type Membership } from "./impl";

const policy: DiscountPolicy = {
  percentFor: vi.fn((membership: Membership, monthsActive: number) => {
    const base = membership === "pro" ? 15 : membership === "plus" ? 8 : 0;
    const loyalty = monthsActive >= 24 ? 5 : monthsActive >= 12 ? 2 : 0;
    return Math.min(base + loyalty, 18);
  }),
};

describe("renewalQuoteCents", () => {
  it("caps the combined membership and loyalty discount at eighteen percent", () => {
    expect(renewalQuoteCents(policy, 20_000, "pro", 30)).toBe(16_400);
    expect(renewalQuoteCents(policy, 20_000, "free", 3)).toBe(20_000);
  });
});
