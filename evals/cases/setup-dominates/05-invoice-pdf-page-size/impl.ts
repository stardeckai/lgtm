export type PdfOptions = { pageSize: "A4" | "LETTER"; marginMm: number };

const PAGE_BY_COUNTRY: Record<string, "A4" | "LETTER"> = { US: "LETTER", CA: "LETTER", PR: "LETTER" };

export function pdfOptionsFor(countryCode: string): PdfOptions {
  const pageSize = PAGE_BY_COUNTRY[countryCode] ?? "A4";
  return { pageSize, marginMm: pageSize === "LETTER" ? 19 : 20 };
}
