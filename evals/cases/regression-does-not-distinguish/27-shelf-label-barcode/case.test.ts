import { describe, expect, it } from "vitest";
import { checkDigit, shelfBarcode } from "./impl";

describe("shelfBarcode", () => {
  it("encodes the sku and price into a check-digited in-store barcode", () => {
    expect(shelfBarcode("4821", 1299)).toBe("2048210012992");
    expect(checkDigit("204821001299")).toBe(2);
  });
});
