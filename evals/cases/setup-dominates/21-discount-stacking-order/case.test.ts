import { describe, expect, test } from "vitest";
import { applyDiscounts, type Discount } from "./impl";

const TEN_PERCENT: Discount = { kind: "percent", value: 10, stackable: true };
const FIVE_POUNDS: Discount = { kind: "fixed", valueCents: 500, stackable: true };
const QUARTER_OFF: Discount = { kind: "percent", value: 25, stackable: false };

describe("applyDiscounts", () => {
  test.each([
    { name: "two stackables compound in order", discounts: [TEN_PERCENT, FIVE_POUNDS], subtotal: 20_000, expected: 17_500 },
    { name: "an exclusive discards the stackables", discounts: [TEN_PERCENT, FIVE_POUNDS, QUARTER_OFF], subtotal: 20_000, expected: 15_000 },
    { name: "an exclusive wins wherever it sits", discounts: [QUARTER_OFF, TEN_PERCENT], subtotal: 20_000, expected: 15_000 },
    { name: "the total never goes below zero", discounts: [FIVE_POUNDS], subtotal: 400, expected: 0 },
    { name: "no discounts leave the subtotal alone", discounts: [], subtotal: 20_000, expected: 20_000 },
  ])("$name", ({ discounts, subtotal, expected }) => {
    expect(applyDiscounts(subtotal, discounts)).toBe(expected);
  });
});
