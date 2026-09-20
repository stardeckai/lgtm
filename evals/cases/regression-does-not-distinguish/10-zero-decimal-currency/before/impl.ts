export type Currency = "USD" | "EUR" | "JPY";

export function minorUnits(currency: Currency): number {
  return currency === "JPY" ? 0 : 2;
}

export function formatAmount(minor: number, currency: Currency): string {
  const value = (minor / 100).toFixed(2);
  return `${value} ${currency}`;
}
