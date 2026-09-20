import { describe, expect, it } from "vitest";
import { totalItems } from "./impl";

describe("totalItems", () => {
  it("adds up the quantity of every line", () => {
    expect(
      totalItems({
        id: "ord_1",
        lines: [
          { sku: "mug", qty: 2, unitCents: 500 },
          { sku: "tee", qty: 3, unitCents: 1_900 },
        ],
      }),
    ).toBe(5);
  });
});
