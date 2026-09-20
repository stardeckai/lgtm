export function formatMoney(cents: number, currency: "USD" | "EUR" | "JPY"): string {
  if (currency === "JPY") return `¥${Math.round(cents / 100).toLocaleString("en-US")}`;
  const amount = (Math.abs(cents) / 100).toFixed(2);
  const symbol = currency === "USD" ? "$" : "€";
  const grouped = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${cents < 0 ? "-" : ""}${symbol}${grouped}`;
}

export function parseMoney(text: string): number {
  const digits = text.replace(/[^0-9.-]/g, "");
  if (digits === "" || Number.isNaN(Number(digits))) throw new Error(`cannot read ${text} as money`);
  return Math.round(Number(digits) * 100);
}

export function sumCents(amounts: number[]): number {
  return amounts.reduce((total, amount) => total + amount, 0);
}
