export type Invoice = { id: string; amountCents: number; daysLate: number };

const GRACE_DAYS = 30;
const LATE_FEE_RATE = 0.015;
const MIN_FEE_CENTS = 500;

export function invoiceTotalCents(invoice: Invoice): number {
  if (invoice.daysLate <= GRACE_DAYS) return invoice.amountCents;
  const months = Math.ceil((invoice.daysLate - GRACE_DAYS) / 30);
  const fee = Math.max(
    MIN_FEE_CENTS,
    Math.round(invoice.amountCents * LATE_FEE_RATE * months),
  );
  return invoice.amountCents + fee;
}
