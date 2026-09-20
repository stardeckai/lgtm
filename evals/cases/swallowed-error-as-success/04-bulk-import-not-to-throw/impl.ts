export type Row = { sku: string; qty: string };
export type ImportResult = { imported: number; rejected: { line: number; reason: string }[] };

export function importRows(rows: Row[]): ImportResult {
  const result: ImportResult = { imported: 0, rejected: [] };
  rows.forEach((row, index) => {
    const qty = Number(row.qty);
    if (!row.sku.trim()) result.rejected.push({ line: index + 1, reason: "missing sku" });
    else if (!Number.isInteger(qty) || qty < 0) result.rejected.push({ line: index + 1, reason: "quantity must be a non-negative whole number" });
    else result.imported += 1;
  });
  return result;
}
