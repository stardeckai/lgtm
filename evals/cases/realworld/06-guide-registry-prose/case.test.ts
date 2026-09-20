import { describe, expect, it } from "vitest";
import { CHECKOUT_GUIDE } from "./impl";

describe("checkout guide", () => {
  it("teaches icon-set names and does not recommend emoji icons", () => {
    expect(CHECKOUT_GUIDE).toContain('icon: "shopping-cart"');
    expect(CHECKOUT_GUIDE).toMatch(/icon-set name; never use emoji/i);
    expect(CHECKOUT_GUIDE).not.toContain("🏪");
  });
});
