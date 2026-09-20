export type InvoiceStatus = "draft" | "open" | "paid" | "uncollectible";

export class Invoice {
  status: InvoiceStatus = "draft";
  paidCents = 0;
  constructor(
    readonly id: string,
    readonly totalCents: number,
  ) {}

  issue(): void {
    if (this.status !== "draft") throw new Error("only a draft can be issued");
    this.status = "open";
  }

  applyPayment(cents: number): void {
    if (this.status !== "open") throw new Error("only an open invoice takes payment");
    this.paidCents += cents;
    if (this.paidCents >= this.totalCents) this.status = "paid";
  }

  writeOff(): void {
    if (this.status === "paid") throw new Error("a paid invoice cannot be written off");
    this.status = "uncollectible";
  }
}

export interface Psp {
  charge(invoiceId: string, cents: number): Promise<{ captured: number }>;
}

export async function collect(psp: Psp, invoice: Invoice, cents: number): Promise<InvoiceStatus> {
  const { captured } = await psp.charge(invoice.id, cents);
  if (captured > 0) invoice.applyPayment(captured);
  return invoice.status;
}
