import { describe, expect, it } from "vitest";
import { Money } from "./impl";

describe("Money", () => {
  it("splits an indivisible amount without losing or inventing a satang", () => {
    const parts = Money.of(10.01, "THB").splitEvenly(3);

    expect(parts.map((p) => p.toString())).toEqual(["THB 3.34", "THB 3.34", "THB 3.33"]);
    expect(parts.reduce((sum, p) => sum.plus(p), Money.of(0, "THB")).toString()).toBe("THB 10.01");
  });
});
