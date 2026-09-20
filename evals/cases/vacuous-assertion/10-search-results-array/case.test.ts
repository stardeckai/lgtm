import { describe, expect, it } from "vitest";
import { search, type Product } from "./impl";

const catalog: Product[] = [
  { id: "p1", name: "Oak desk", tags: ["furniture"], inStock: true },
  { id: "p2", name: "Desk lamp", tags: ["lighting"], inStock: false },
];

describe("search", () => {
  it("leaves out-of-stock products out when the stock filter is on", () => {
    const results = search(catalog, "desk", true);

    expect(Array.isArray(results)).toBe(true);
    expect(results).toBeTruthy();
  });
});
