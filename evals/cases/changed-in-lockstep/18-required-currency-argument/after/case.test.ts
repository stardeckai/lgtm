import { describe, expect, it } from "vitest";
import { formatMinor } from "./impl";

describe("formatMinor", () => {
  it("keeps the minor units of each amount", () => {
    expect(formatMinor(1999, "USD")).toBe("19.99");
    expect(formatMinor(5, "USD")).toBe("0.05");
    expect(formatMinor(-250, "USD")).toBe("-2.50");
    expect(formatMinor(1999, "JPY")).toBe("1999");
    expect(formatMinor(1999, "KWD")).toBe("1.999");
  });
});
