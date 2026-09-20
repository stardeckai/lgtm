export type Receivable = { invoiceId: string; dueDate: string; openCents: number };
export type Aging = { current: number; d1to30: number; d31to60: number; d61plus: number };

const DAY_MS = 86_400_000;

export function ageReceivables(rows: Receivable[], asOf: string): Aging {
  const today = Date.parse(asOf);
  const buckets: Aging = { current: 0, d1to30: 0, d31to60: 0, d61plus: 0 };
  for (const row of rows) {
    const daysLate = Math.floor((today - Date.parse(row.dueDate)) / DAY_MS);
    if (daysLate <= 0) buckets.current += row.openCents;
    else if (daysLate <= 30) buckets.d1to30 += row.openCents;
    else if (daysLate <= 60) buckets.d31to60 += row.openCents;
    else buckets.d61plus += row.openCents;
  }
  return buckets;
}
