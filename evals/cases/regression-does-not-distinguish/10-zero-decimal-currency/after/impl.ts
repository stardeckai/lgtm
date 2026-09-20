export type Currency = "USD" | "EUR" | "JPY";

export function minorUnits(currency: Currency): number {
  return currency === "JPY" ? 0 : 2;
}

export function formatAmount(minor: number, currency: Currency): string {
  const digits = minorUnits(currency);
  const value = (minor / 10 ** digits).toFixed(digits);
  return `${value} ${currency}`;
}
