export type Invoice = { id: string; cents: number; paidAt: string | null };

export class InvoiceStore {
  private rows = new Map<string, Invoice>();
  put(invoice: Invoice): void {
    this.rows.set(invoice.id, invoice);
  }
  get(id: string): Invoice | null {
    return this.rows.get(id) ?? null;
  }
}

export type Gateway = { charge(cents: number): Promise<{ ok: boolean }> };

export async function settleInvoice(
  store: InvoiceStore,
  gateway: Gateway,
  now: () => Date,
  id: string,
): Promise<Invoice> {
  const invoice = store.get(id);
  if (!invoice) throw new Error(`unknown invoice ${id}`);
  const result = await gateway.charge(invoice.cents);
  if (!result.ok) return invoice;
  const settled: Invoice = { ...invoice, paidAt: now().toISOString() };
  store.put(settled);
  return settled;
}
