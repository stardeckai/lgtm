import { describe, expect, it } from "vitest";
import { penaltyCents } from "./impl";

describe("penaltyCents", () => {
  it("starts charging on the first day after the 30 day grace period", () => {
    expect(penaltyCents({ principalCents: 500000, daysLate: 30, hardship: false })).toBe(0);
    expect(penaltyCents({ principalCents: 500000, daysLate: 31, hardship: false })).toBe(200);
    expect(penaltyCents({ principalCents: 500000, daysLate: 35, hardship: false })).toBe(1000);
  });
});
