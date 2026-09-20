import { describe, expect, it } from "vitest";
import { isActive } from "./impl";

describe("isActive", () => {
  it("is true only for the active status", () => {
    expect(isActive({ id: "sub_1", status: "active", currentPeriodEndMs: 0 })).toBe(true);
    expect(isActive({ id: "sub_2", status: "trialing", currentPeriodEndMs: 0 })).toBe(false);
    expect(isActive({ id: "sub_3", status: "past_due", currentPeriodEndMs: 0 })).toBe(false);
  });
});
