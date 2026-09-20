import { describe, expect, it } from "vitest";
import { segments, unitCount } from "./impl";

describe("segments", () => {
  it("counts an escaped character twice and drops to the shorter unicode limit for an emoji", () => {
    expect(unitCount("a".repeat(160))).toBe(160);
    expect(segments("a".repeat(160))).toBe(1);
    expect(segments("a".repeat(161))).toBe(2);
    expect(unitCount("a".repeat(159) + "€")).toBe(161);
    expect(segments("a".repeat(159) + "€")).toBe(2);
    expect(segments("a".repeat(70) + "🙂")).toBe(2);
  });
});
