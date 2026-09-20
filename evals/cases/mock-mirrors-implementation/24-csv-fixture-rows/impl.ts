export interface Downloader {
  text(url: string): Promise<string>;
}

export type Row = { sku: string; qty: number; unitCents: number };

export type ImportResult = { rows: Row[]; skipped: Array<{ line: number; reason: string }> };

export async function importCatalog(downloader: Downloader, url: string): Promise<ImportResult> {
  const body = await downloader.text(url);
  const lines = body.split(/\r?\n/).filter((line) => line.trim() !== "");
  const [, ...dataLines] = lines;
  const rows: Row[] = [];
  const skipped: Array<{ line: number; reason: string }> = [];
  dataLines.forEach((line, index) => {
    const [sku, qty, price] = line.split(",");
    const qtyNum = Number(qty);
    if (!sku) return skipped.push({ line: index + 2, reason: "missing sku" });
    if (!Number.isInteger(qtyNum) || qtyNum < 0) {
      return skipped.push({ line: index + 2, reason: "bad quantity" });
    }
    rows.push({ sku, qty: qtyNum, unitCents: Math.round(Number(price) * 100) });
  });
  return { rows, skipped };
}
