import { describe, expect, it } from "vitest";
import { toCsv } from "./impl";

describe("toCsv", () => {
  it("wraps fields containing a comma in double quotes", () => {
    const csv = toCsv([
      ["sku", "name", "price"],
      ["A-1", "Desk lamp", "1999"],
    ]);

    expect(csv).toBe("sku,name,price\r\nA-1,Desk lamp,1999");
  });
});
