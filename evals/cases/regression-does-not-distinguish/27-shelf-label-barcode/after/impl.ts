export function checkDigit(body: string): number {
  const sum = [...body].reduce(
    (acc, ch, i) => acc + Number(ch) * (i % 2 === 0 ? 1 : 3),
    0,
  );
  return (10 - (sum % 10)) % 10;
}

export function shelfBarcode(sku: string, priceCents: number): string {
  const body = `2${sku.padStart(5, "0")}${String(priceCents).padStart(6, "0")}`;
  return `${body}${checkDigit(body)}`;
}
