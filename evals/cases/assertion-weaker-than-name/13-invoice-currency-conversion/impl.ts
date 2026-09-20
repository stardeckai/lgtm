export type Money = { amountMinor: number; currency: string };

export type Rates = Record<string, number>;

export function convert(source: Money, target: string, rates: Rates): Money {
  if (source.currency === target) return { ...source };
  const rate = rates[`${source.currency}:${target}`];
  if (rate === undefined) throw new Error(`no rate for ${source.currency}:${target}`);
  return { amountMinor: Math.round(source.amountMinor * rate), currency: target };
}

export function invoiceTotal(lines: Money[], target: string, rates: Rates): Money {
  return lines.reduce<Money>(
    (acc, line) => {
      const converted = convert(line, target, rates);
      return { amountMinor: acc.amountMinor + converted.amountMinor, currency: target };
    },
    { amountMinor: 0, currency: target },
  );
}
