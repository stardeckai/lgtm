import { describe, expect, it } from "vitest";
import { linePriceCents, type Rule, type RuleEngine } from "./impl";

const rules: Rule[] = [
  { id: "bulk", when: { minQty: 10 }, thenPercentOff: 10 },
  { id: "sku-sale", when: { sku: "LAMP-2" }, thenPercentOff: 25 },
  { id: "clearance", when: { sku: "LAMP-2", minQty: 50 }, thenPercentOff: 40 },
];

const engine: RuleEngine = {
  applicable(all, line) {
    return all
      .filter(
        (rule) =>
          (rule.when.sku === undefined || rule.when.sku === line.sku) &&
          (rule.when.minQty === undefined || line.qty >= rule.when.minQty),
      )
      .sort((a, b) => b.thenPercentOff - a.thenPercentOff)
      .slice(0, 1);
  },
};

describe("linePriceCents", () => {
  it("applies only the single deepest matching rule instead of stacking them", () => {
    expect(linePriceCents(engine, rules, { sku: "LAMP-2", qty: 12, unitCents: 2000 })).toBe(18_000);
  });
});
