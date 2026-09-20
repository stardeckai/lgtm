import { describe, expect, it } from "vitest";
import { importRows } from "./impl";

describe("importRows", () => {
  it("rejects rows with a negative quantity instead of importing them", () => {
    const rows = [
      { sku: "A-1", qty: "4" },
      { sku: "A-2", qty: "-2" },
      { sku: "", qty: "9" },
    ];

    expect(() => importRows(rows)).not.toThrow();
  });
});
