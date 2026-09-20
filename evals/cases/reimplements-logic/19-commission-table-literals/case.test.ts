import { describe, expect, it } from "vitest";
import { metredChargeCents } from "./impl";

const examples: Array<[units: number, expectedCents: number]> = [
  [0, 0],
  [1, 40],
  [100, 4000],
  [101, 4032],
  [500, 16800],
  [750, 23050],
];

describe("metredChargeCents", () => {
  it("prices each tier band at its own rate", () => {
    expect(examples.map(([units]) => metredChargeCents(units))).toEqual(
      examples.map(([, expected]) => expected),
    );
  });
});
