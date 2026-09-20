import { describe, expect, it } from "vitest";
import { isDomestic, validateAddress } from "./impl";

describe("isDomestic", () => {
  it("treats a lowercase country code on the address as the same country as the merchant", () => {
    const address = validateAddress({
      line1: "8 Marina Blvd",
      city: "Singapore",
      postcode: "018981",
      country: "sg",
    });

    expect(isDomestic(address, "SG")).toBe(true);
    expect(isDomestic(address, "us")).toBe(false);
  });
});
