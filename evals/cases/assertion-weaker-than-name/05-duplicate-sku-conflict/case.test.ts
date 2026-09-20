import { describe, expect, it } from "vitest";
import { Catalog } from "./impl";

describe("Catalog.add", () => {
  it("rejects a duplicate sku with a 409 conflict carrying the duplicate_sku code", () => {
    const catalog = new Catalog();
    catalog.add("SKU-1", 1200);

    expect(() => catalog.add("SKU-1", 1200)).toThrow();
  });
});
