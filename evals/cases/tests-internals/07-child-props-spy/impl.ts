import React from "react";
import { PriceTag } from "./price-tag";

export type Line = { sku: string; qty: number; unitCents: number };

export function CartSummary({ lines, taxBps }: { lines: Line[]; taxBps: number }) {
  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.unitCents, 0);
  const tax = Math.round((subtotal * taxBps) / 10_000);
  return (
    <div>
      <ul>
        {lines.map((l) => (
          <li key={l.sku}>
            {l.sku} × {l.qty}
          </li>
        ))}
      </ul>
      <PriceTag label="Tax" cents={tax} />
      <PriceTag label="Total" cents={subtotal + tax} />
    </div>
  );
}
