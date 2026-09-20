export type CartLine = { sku: string; qty: number; unitCents: number };

export function cartTotalCents(lines: CartLine[], taxRate: number): number {
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.unitCents, 0);
  return subtotal + Math.round(subtotal * taxRate);
}
