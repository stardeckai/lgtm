export type QuoteLine = { sku: string; description: string; qty: number; listCents: number };

export type QuoteModel = {
  header: { number: string; validUntil: string; currency: string; preparedBy: string };
  lines: { sku: string; description: string; qty: number; unitCents: number; discountPercent: number; totalCents: number }[];
  footer: { subtotalCents: number; termsUrl: string; signatureBlock: string };
};

function discountFor(qty: number): number {
  if (qty >= 100) return 20;
  if (qty >= 50) return 12;
  if (qty >= 10) return 5;
  return 0;
}

export function buildQuoteModel(number: string, lines: QuoteLine[]): QuoteModel {
  const priced = lines.map((line) => {
    const discountPercent = discountFor(line.qty);
    const unitCents = Math.round(line.listCents * (1 - discountPercent / 100));
    return { ...line, unitCents, discountPercent, totalCents: unitCents * line.qty };
  });
  return {
    header: { number, validUntil: "2024-09-30", currency: "USD", preparedBy: "sales@example.com" },
    lines: priced,
    footer: {
      subtotalCents: priced.reduce((sum, l) => sum + l.totalCents, 0),
      termsUrl: "https://example.com/terms",
      signatureBlock: "Authorised signature ____________________",
    },
  };
}
