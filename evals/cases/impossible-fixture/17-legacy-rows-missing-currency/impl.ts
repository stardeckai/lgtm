export type PaymentRow = { id: string; amountMinor: number; currency?: string };

export function writePayment(id: string, amountMinor: number, currency: string): PaymentRow {
  if (currency.length !== 3) throw new Error("currency must be an ISO 4217 code");
  return { id, amountMinor, currency };
}

export function formatPaymentAmount(row: PaymentRow): string {
  const currency = row.currency ?? "USD";
  const zeroDecimal = currency === "JPY" || currency === "KRW";
  const amount = zeroDecimal ? String(row.amountMinor) : (row.amountMinor / 100).toFixed(2);
  return `${amount} ${currency}`;
}
