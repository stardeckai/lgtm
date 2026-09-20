import React from "react";

export function PriceTag({ label, cents }: { label: string; cents: number }) {
  return (
    <p>
      {label}: ฿{(cents / 100).toFixed(2)}
    </p>
  );
}
