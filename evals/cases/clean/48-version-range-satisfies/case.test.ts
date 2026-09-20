import { describe, expect, it } from "vitest";
import { satisfiesCaret } from "./impl";

describe("satisfiesCaret", () => {
  it("lets a caret range float on minor for 1.x but pins the minor for 0.x", () => {
    expect(satisfiesCaret("1.4.0", "^1.2.3")).toBe(true);
    expect(satisfiesCaret("1.2.2", "^1.2.3")).toBe(false);
    expect(satisfiesCaret("2.0.0", "^1.2.3")).toBe(false);
    expect(satisfiesCaret("0.6.9", "^0.6.1")).toBe(true);
    expect(satisfiesCaret("0.7.0", "^0.6.1")).toBe(false);
    expect(satisfiesCaret("0.0.3", "^0.0.3")).toBe(true);
    expect(satisfiesCaret("0.0.4", "^0.0.3")).toBe(false);
  });
});
