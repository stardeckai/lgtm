import { describe, expect, it } from "vitest";
import { receiptBody } from "./impl";

describe("receiptBody", () => {
  it("right-aligns the amount inside the paper width", () => {
    expect(receiptBody([{ name: "Latte", qty: 2, unitCents: 350 }], 24)).toEqual([
      "2 x Latte           7.00",
    ]);
  });

  it("keeps at least one space when the line is wider than the paper", () => {
    expect(receiptBody([{ name: "Extra hot oat flat white", qty: 1, unitCents: 495 }], 10)).toEqual([
      "1 x Extra hot oat flat white 4.95",
    ]);
  });
});
