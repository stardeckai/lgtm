export function escapeCsvField(value: string, delimiter = ","): string {
  const mustQuote =
    value.includes(delimiter) || value.includes('"') || /[\r\n]/.test(value) || value !== value.trim();
  if (!mustQuote) return value;
  return `"${value.replace(/"/g, '""')}"`;
}

export function toCsvRow(fields: string[], delimiter = ","): string {
  return fields.map((field) => escapeCsvField(field, delimiter)).join(delimiter);
}
