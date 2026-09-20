import { describe, expect, it } from "vitest";
import { hasItems } from "./impl";

describe("hasItems", () => {
  it("is true when the basket has at least one item", () => {
    expect(hasItems({ id: "bsk_1", items: [{ sku: "mug", qty: 1 }] })).toBe(true);
    expect(hasItems({ id: "bsk_2", items: [] })).toBe(false);
  });
});
