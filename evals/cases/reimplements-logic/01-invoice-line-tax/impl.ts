export type InvoiceLine = { description: string; quantity: number; unitCents: number };

export type LineTotal = { netCents: number; taxCents: number; grossCents: number };

export function lineTotal(line: InvoiceLine, taxRatePercent: number): LineTotal {
  const netCents = line.quantity * line.unitCents;
  const taxCents = Math.round((netCents * taxRatePercent) / 100);
  return { netCents, taxCents, grossCents: netCents + taxCents };
}

export function invoiceGrossCents(lines: InvoiceLine[], taxRatePercent: number): number {
  return lines.reduce((sum, line) => sum + lineTotal(line, taxRatePercent).grossCents, 0);
}
