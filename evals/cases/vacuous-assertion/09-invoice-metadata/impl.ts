export type Invoice = { number: string; customerId: string; totalCents: number; currency: string };

export function pdfMetadata(invoice: Invoice, locale: string): Record<string, string> {
  const amount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: invoice.currency,
  }).format(invoice.totalCents / 100);
  return {
    Title: `Invoice ${invoice.number}`,
    Subject: `Amount due ${amount}`,
    Keywords: [invoice.customerId, invoice.currency, "invoice"].join(","),
    Producer: "billing-service",
  };
}
