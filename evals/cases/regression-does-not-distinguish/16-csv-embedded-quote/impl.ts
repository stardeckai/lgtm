export function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function csvRow(values: string[]): string {
  return values.map(csvField).join(",");
}
