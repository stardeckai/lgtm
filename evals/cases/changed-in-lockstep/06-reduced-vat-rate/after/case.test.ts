import { describe, expect, it } from "vitest";
import { grossCents } from "./impl";

describe("grossCents", () => {
  it("adds VAT to the net total of the invoice", () => {
    expect(grossCents([{ sku: "A", netCents: 10000 }])).toBe(11700);
    expect(grossCents([{ sku: "A", netCents: 999 }, { sku: "B", netCents: 1 }])).toBe(1170);
  });
});
