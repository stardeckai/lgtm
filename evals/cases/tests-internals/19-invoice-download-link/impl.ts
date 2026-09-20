import React from "react";

export type Invoice = { id: string; number: string; status: "draft" | "issued" | "void" };

export function downloadUrl(invoice: Invoice): string | null {
  if (invoice.status !== "issued") return null;
  return `/api/invoices/${invoice.id}/pdf?v=${encodeURIComponent(invoice.number)}`;
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const href = downloadUrl(invoice);
  return (
    <div>
      <span>{invoice.number}</span>
      {href ? (
        <a href={href} download>
          Download PDF
        </a>
      ) : (
        <span>PDF available once issued</span>
      )}
    </div>
  );
}
