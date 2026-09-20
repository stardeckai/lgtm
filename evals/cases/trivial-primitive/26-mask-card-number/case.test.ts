import { describe, expect, it } from "vitest";
import { maskPan } from "./impl";

describe("maskPan", () => {
  it("never leaves more than the bin and the last four digits readable", () => {
    expect(maskPan("4242 4242 4242 4242")).toBe("424242******4242");
    expect(maskPan("378282246310005")).toBe("378282*****0005");
    expect(maskPan("4222222222222")).toBe("422222***2222");
    expect(() => maskPan("4242")).toThrow("not a card number");
  });
});
