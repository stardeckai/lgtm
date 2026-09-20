import { describe, expect, it } from "vitest";
import { initials } from "./impl";

describe("initials", () => {
  it("takes the first letter of each word in the name", () => {
    expect(initials({ fullName: "Grace Hopper", email: "g@example.com", company: "Navy" })).toBe("GH");
  });
});
