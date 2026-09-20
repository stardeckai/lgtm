import { describe, expect, it } from "vitest";
import { getAccountDisplayName } from "./impl";

describe("getAccountDisplayName", () => {
  it("uses the optional display name and falls back to the legal company name", () => {
    expect(getAccountDisplayName({ displayName: "Northwind", companyName: "Northwind Holdings Ltd" })).toBe(
      "Northwind"
    );
    expect(getAccountDisplayName({ displayName: "  ", companyName: "Northwind Holdings Ltd" })).toBe(
      "Northwind Holdings Ltd"
    );
  });
});
