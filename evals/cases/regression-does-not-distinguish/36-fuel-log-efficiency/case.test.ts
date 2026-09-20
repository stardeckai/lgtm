import { describe, expect, it } from "vitest";
import { litresPerHundredKm, type Fill } from "./impl";

describe("litresPerHundredKm", () => {
  it("ignores the litres in the opening fill, which were burnt before the log started", () => {
    const fills: Fill[] = [
      { odometerKm: 10000, litres: 40 },
      { odometerKm: 10450, litres: 31.5 },
      { odometerKm: 10900, litres: 30.5 },
    ];

    expect(litresPerHundredKm(fills)).toBe(6.9);
  });

  it("has nothing to report from a single fill", () => {
    expect(litresPerHundredKm([{ odometerKm: 10000, litres: 40 }])).toBeNull();
  });

  it("refuses a log whose odometer went backwards", () => {
    expect(
      litresPerHundredKm([
        { odometerKm: 10900, litres: 40 },
        { odometerKm: 10000, litres: 30 },
      ]),
    ).toBeNull();
  });
});
