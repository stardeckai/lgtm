export type RawInvoice = { number: string; amount: string; dueDate: string };
export type Parsed = { number: string; amountCents: number; dueDate: string };
export type Report = { parsed: Parsed[]; errors: { number: string; message: string }[] };

export function parseInvoices(rows: RawInvoice[]): Report {
  const report: Report = { parsed: [], errors: [] };
  for (const row of rows) {
    try {
      const amountCents = Math.round(Number(row.amount.replace(/[^0-9.-]/g, "")) * 100);
      if (!Number.isFinite(amountCents)) throw new Error("amount is not a number");
      if (Number.isNaN(Date.parse(row.dueDate))) throw new Error("due date is not a date");
      report.parsed.push({ number: row.number, amountCents, dueDate: new Date(row.dueDate).toISOString() });
    } catch (err) {
      report.errors.push({ number: row.number, message: (err as Error).message });
    }
  }
  return report;
}
