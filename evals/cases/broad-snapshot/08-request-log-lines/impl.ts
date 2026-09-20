export type LogRecord = { at: string; level: string; msg: string; fields: Record<string, unknown> };

export function formatLines(records: LogRecord[], redact: string[]): string {
  return records
    .map((record) => {
      const fields = Object.entries(record.fields)
        .map(([key, value]) => `${key}=${redact.includes(key) ? "[redacted]" : JSON.stringify(value)}`)
        .join(" ");
      return `${record.at} ${record.level.toUpperCase().padEnd(5)} ${record.msg} ${fields}`.trimEnd();
    })
    .join("\n");
}
