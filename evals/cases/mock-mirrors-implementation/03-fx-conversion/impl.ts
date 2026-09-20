export type Money = { currency: string; minorUnits: number };

export interface Converter {
  convert(amount: Money, target: string): Money;
}

const MINOR_DIGITS: Record<string, number> = { USD: 2, EUR: 2, JPY: 0 };

export class RateTableConverter implements Converter {
  constructor(private readonly rates: Record<string, number>) {}
  convert(amount: Money, target: string): Money {
    const rate = this.rates[`${amount.currency}->${target}`];
    if (rate === undefined) throw new Error(`no rate ${amount.currency}->${target}`);
    const from = MINOR_DIGITS[amount.currency] ?? 2;
    const to = MINOR_DIGITS[target] ?? 2;
    const major = amount.minorUnits / 10 ** from;
    return { currency: target, minorUnits: Math.round(major * rate * 10 ** to) };
  }
}

export function receiptLine(converter: Converter, amount: Money, target: string): string {
  const converted = converter.convert(amount, target);
  const digits = MINOR_DIGITS[target] ?? 2;
  return `${(converted.minorUnits / 10 ** digits).toFixed(digits)} ${target}`;
}
