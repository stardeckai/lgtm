import { describe, expect, it } from "vitest";
import { lateFeeCents } from "./impl";

describe("lateFeeCents", () => {
  it("charges nothing inside the grace period and 1.5% after it", () => {
    expect(lateFeeCents(4, 10000)).toBe(0);
    expect(lateFeeCents(5, 10000)).toBe(150);
  });
});
