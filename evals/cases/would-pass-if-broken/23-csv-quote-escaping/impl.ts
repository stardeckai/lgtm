export function escapeField(field: string): string {
  if (!/[",\r\n]/.test(field)) return field;
  return `"${field.replace(/"/g, '""')}"`;
}

export function parseField(raw: string): string {
  if (!raw.startsWith('"')) return raw;
  return raw.slice(1, -1).replace(/""/g, '"');
}
