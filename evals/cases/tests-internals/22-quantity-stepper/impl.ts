import React, { useState } from "react";

export function clampQty(value: number, max: number): number {
  if (Number.isNaN(value) || value < 1) return 1;
  return Math.min(value, max);
}

export function QuantityStepper({ max, onChange }: { max: number; onChange: (n: number) => void }) {
  const [qty, setQty] = useState(1);
  const set = (next: number) => {
    const clamped = clampQty(next, max);
    setQty(clamped);
    onChange(clamped);
  };
  return (
    <div>
      <button aria-label="Decrease" onClick={() => set(qty - 1)}>
        −
      </button>
      <input aria-label="Quantity" value={String(qty)} onChange={(e) => set(Number(e.target.value))} />
      <button aria-label="Increase" onClick={() => set(qty + 1)}>
        +
      </button>
      {qty === max ? <p>Only {max} left in stock</p> : null}
    </div>
  );
}
