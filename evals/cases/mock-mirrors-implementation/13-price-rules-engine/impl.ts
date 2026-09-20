export type Rule = { id: string; when: { minQty?: number; sku?: string }; thenPercentOff: number };

export interface RuleEngine {
  applicable(rules: Rule[], line: { sku: string; qty: number }): Rule[];
}

export const firstMatchEngine: RuleEngine = {
  applicable(rules, line) {
    const matches = rules.filter(
      (rule) =>
        (rule.when.sku === undefined || rule.when.sku === line.sku) &&
        (rule.when.minQty === undefined || line.qty >= rule.when.minQty),
    );
    return matches.sort((a, b) => b.thenPercentOff - a.thenPercentOff).slice(0, 1);
  },
};

export function linePriceCents(
  engine: RuleEngine,
  rules: Rule[],
  line: { sku: string; qty: number; unitCents: number },
): number {
  const [rule] = engine.applicable(rules, line);
  const gross = line.qty * line.unitCents;
  return rule ? gross - Math.round((gross * rule.thenPercentOff) / 100) : gross;
}
