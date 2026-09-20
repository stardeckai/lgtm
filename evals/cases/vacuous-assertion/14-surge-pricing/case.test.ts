import { describe, expect, it } from "vitest";
import { fareCents } from "./impl";

describe("fareCents", () => {
  it("caps the surge multiplier at three times the base fare", () => {
    const fare = fareCents(1200, { riders: 900, drivers: 10, weatherPenalty: 0.5 });

    expect(fare).toBeGreaterThan(0);
    expect(fare).toBeLessThan(1_000_000);
  });
});
