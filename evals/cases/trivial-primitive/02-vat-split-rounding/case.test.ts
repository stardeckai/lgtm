import { describe, expect, it } from "vitest";
import { splitVatCents } from "./impl";

describe("splitVatCents", () => {
  it("keeps net plus VAT equal to the gross amount when the split rounds", () => {
    expect(splitVatCents(1999, 7)).toEqual({ netCents: 1868, vatCents: 131 });
    expect(splitVatCents(1, 20)).toEqual({ netCents: 1, vatCents: 0 });
    expect(splitVatCents(105, 5)).toEqual({ netCents: 100, vatCents: 5 });
  });
});
