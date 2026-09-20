export type WebhookEvent = { type: string; payload: Record<string, unknown> };
export type Invoice = { id: string; paymentLinkId: string; paymentStatus: "open" | "paid" };

export class InvoiceStore {
  readonly rows: Invoice[] = [];

  seed(invoice: Invoice): void {
    this.rows.push(invoice);
  }

  byLink(paymentLinkId: string): Invoice | undefined {
    return this.rows.find((row) => row.paymentLinkId === paymentLinkId);
  }
}

/**
 * The gateway retries on any non-2xx, so this never throws: it settles what it
 * can and returns.
 */
export async function handleGatewayWebhook(store: InvoiceStore, event: WebhookEvent): Promise<void> {
  if (event.type !== "payment_link.paid") return;
  const linkId = event.payload.paymentLinkId;
  if (typeof linkId !== "string") return;
  const invoice = store.byLink(linkId);
  if (!invoice) return;
  invoice.paymentStatus = "paid";
}
