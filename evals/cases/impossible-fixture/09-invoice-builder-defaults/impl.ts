export type InvoiceLine = { description: string; quantity: number; unitCents: number };
export type Invoice = {
  id: string;
  customerId: string;
  lines: InvoiceLine[];
  discountCents: number;
};

export function createInvoice(input: Invoice): Invoice {
  if (input.lines.length === 0) throw new Error("an invoice needs at least one line");
  if (input.lines.some((line) => line.quantity <= 0)) throw new Error("line quantity must be positive");
  const subtotal = input.lines.reduce((sum, line) => sum + line.quantity * line.unitCents, 0);
  if (input.discountCents > subtotal) throw new Error("discount exceeds the invoice subtotal");
  return input;
}

export function invoiceTotalCents(invoice: Invoice): number {
  const subtotal = invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitCents, 0);
  return Math.max(0, subtotal - invoice.discountCents);
}
