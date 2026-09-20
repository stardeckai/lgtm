import { describe, expect, it } from "vitest";
import { applyCreditMargin, CREDIT_MARGIN_MULTIPLIER } from "./impl";

describe("applyCreditMargin", () => {
  it("marks wholesale credits up by 1.75x and never charges for a non-positive cost", () => {
    expect(CREDIT_MARGIN_MULTIPLIER).toBe(1.75);
    expect(applyCreditMargin(10)).toBe(17.5);
    expect(applyCreditMargin(8.57)).toBe(14.9975);
    expect(applyCreditMargin(0)).toBe(0);
    expect(applyCreditMargin(-1)).toBe(0);
  });
});
