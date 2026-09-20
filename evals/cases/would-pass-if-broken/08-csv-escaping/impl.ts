export function toCsvRow(fields: string[]): string {
  return fields
    .map((field) => {
      const needsQuotes = /[",\r\n]/.test(field);
      if (!needsQuotes) return field;
      return `"${field.replace(/"/g, '""')}"`;
    })
    .join(",");
}

export function toCsv(rows: string[][]): string {
  return rows.map(toCsvRow).join("\r\n");
}
