import { describe, expect, it } from "vitest";
import { toE164 } from "./impl";

describe("toE164", () => {
  it("strips the national trunk prefix and keeps numbers that already carry a country code", () => {
    expect(toE164("081 234 5678", "66")).toBe("+66812345678");
    expect(toE164("+66 81 234 5678", "66")).toBe("+66812345678");
    expect(toE164("0066812345678", "66")).toBe("+66812345678");
    expect(toE164("(020) 7946 0958", "44")).toBe("+442079460958");
  });
});
