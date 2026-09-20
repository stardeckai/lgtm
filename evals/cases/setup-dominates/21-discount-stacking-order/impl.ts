export type Discount =
  | { kind: "percent"; value: number; stackable: boolean }
  | { kind: "fixed"; valueCents: number; stackable: boolean };

export function applyDiscounts(subtotalCents: number, discounts: Discount[]): number {
  const stackable = discounts.filter((d) => d.stackable);
  const exclusive = discounts.filter((d) => !d.stackable);
  const chosen = exclusive.length > 0 ? [exclusive[0]!] : stackable;
  let total = subtotalCents;
  for (const discount of chosen) {
    total = discount.kind === "percent" ? total - Math.round((total * discount.value) / 100) : total - discount.valueCents;
  }
  return Math.max(0, total);
}
