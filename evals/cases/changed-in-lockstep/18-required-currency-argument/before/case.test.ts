import { describe, expect, it } from "vitest";
import { formatMinor } from "./impl";

describe("formatMinor", () => {
  it("keeps the minor units of each amount", () => {
    expect(formatMinor(1999)).toBe("19.99");
    expect(formatMinor(5)).toBe("0.05");
    expect(formatMinor(-250)).toBe("-2.50");
  });
});
