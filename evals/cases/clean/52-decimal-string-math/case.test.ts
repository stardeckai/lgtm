import { describe, expect, it } from "vitest";
import { addDecimal, formatDecimal, parseDecimal } from "./impl";

describe("addDecimal", () => {
  it("adds amounts of different precision without the drift a float would introduce", () => {
    const sum = addDecimal(parseDecimal("0.1"), parseDecimal("0.2"));

    expect(formatDecimal(sum)).toBe("0.3");
    expect(formatDecimal(addDecimal(parseDecimal("19.99"), parseDecimal("0.001")))).toBe("19.991");
    expect(formatDecimal(addDecimal(parseDecimal("-5.5"), parseDecimal("5.50")))).toBe("0.00");
    expect(formatDecimal(addDecimal(parseDecimal("99999999999999999.99"), parseDecimal("0.01")))).toBe("100000000000000000.00");
    expect(() => parseDecimal("1,5")).toThrow(SyntaxError);
  });
});
