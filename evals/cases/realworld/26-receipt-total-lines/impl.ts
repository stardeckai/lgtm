export type ReceiptBlock = { label: string; right: string; bold?: boolean };

export function formatReceiptCurrency(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100).toLocaleString("en-US");
  return `${sign}${whole}.${String(abs % 100).padStart(2, "0")}`;
}

export type ReceiptInput = { subtotalCents: number; taxCents: number; discountCents: number };

export function renderReceiptBlocks(input: ReceiptInput): ReceiptBlock[] {
  const total = input.subtotalCents - input.discountCents + input.taxCents;
  return [
    { label: "Subtotal", right: formatReceiptCurrency(input.subtotalCents) },
    { label: "Discount", right: formatReceiptCurrency(-input.discountCents) },
    { label: "Tax", right: formatReceiptCurrency(input.taxCents) },
    { label: "TOTAL", right: formatReceiptCurrency(total), bold: true },
  ];
}

export function findBlock(blocks: ReceiptBlock[], label: string): ReceiptBlock | undefined {
  return blocks.find((block) => block.label === label);
}
