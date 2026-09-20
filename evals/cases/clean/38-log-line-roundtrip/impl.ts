export type LogRecord = { level: "info" | "warn" | "error"; message: string; fields: Record<string, string | number> };

export function formatLine(record: LogRecord): string {
  const fields = Object.entries(record.fields)
    .map(([key, value]) => `${key}=${typeof value === "number" ? value : JSON.stringify(String(value))}`)
    .join(" ");
  return `level=${record.level} msg=${JSON.stringify(record.message)}${fields ? ` ${fields}` : ""}`;
}

export function parseLine(line: string): LogRecord {
  const pairs: Array<[string, string]> = [];
  const pattern = /(\w+)=("(?:[^"\\]|\\.)*"|\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(line)) !== null) pairs.push([match[1]!, match[2]!]);
  const raw = new Map(pairs);
  const fields: Record<string, string | number> = {};
  for (const [key, value] of pairs) {
    if (key === "level" || key === "msg") continue;
    fields[key] = value.startsWith('"') ? (JSON.parse(value) as string) : Number(value);
  }
  return {
    level: (raw.get("level") ?? "info") as LogRecord["level"],
    message: JSON.parse(raw.get("msg") ?? '""') as string,
    fields,
  };
}
