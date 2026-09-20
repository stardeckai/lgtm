import { describe, expect, it } from "vitest";
import { clampDepositToTotal } from "./impl";

describe("deposit safeguards", () => {
  it("refuses negative or non-finite money instead of inventing a free deposit", () => {
    expect(() => clampDepositToTotal(-1_000, 14_900)).toThrow("Invalid deposit amount");
    expect(() => clampDepositToTotal(15_000, -1)).toThrow("Invalid total amount");
    expect(() => clampDepositToTotal(Number.NaN, 14_900)).toThrow("Invalid deposit amount");
    expect(() => clampDepositToTotal(Number.POSITIVE_INFINITY, 14_900)).toThrow(
      "Invalid deposit amount",
    );
  });

  it("never asks for a deposit larger than the total owed", () => {
    expect(clampDepositToTotal(15_000, 14_900)).toBe(14_900);
  });
});
