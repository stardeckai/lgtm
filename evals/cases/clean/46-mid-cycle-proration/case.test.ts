import { describe, expect, it } from "vitest";
import { netDueCents, prorate } from "./impl";

describe("prorate", () => {
  it("charges only the unused part of the cycle and never refunds on a downgrade", () => {
    const basic = { name: "basic", monthlyCents: 1000 };
    const pro = { name: "pro", monthlyCents: 3000 };

    expect(prorate(basic, pro, 16, 30)).toEqual({ chargeCents: 1500, creditCents: 500 });
    expect(netDueCents(basic, pro, 16, 30)).toBe(1000);
    expect(netDueCents(basic, pro, 1, 30)).toBe(2000);
    expect(netDueCents(basic, pro, 30, 30)).toBe(67);
    expect(netDueCents(pro, basic, 16, 30)).toBe(0);
    expect(() => prorate(basic, pro, 31, 30)).toThrow(RangeError);
  });
});
