export function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value}"`;
  return value;
}

export function csvRow(values: string[]): string {
  return values.map(csvField).join(",");
}
