export type Column = { header: string; align: "left" | "right" };

export function markdownTable(columns: Column[], rows: string[][]): string {
  const widths = columns.map((column, i) =>
    Math.max(column.header.length, ...rows.map((row) => (row[i] ?? "").length)),
  );
  const pad = (value: string, i: number) =>
    columns[i]!.align === "right" ? value.padStart(widths[i]!) : value.padEnd(widths[i]!);
  const header = `| ${columns.map((c, i) => pad(c.header, i)).join(" | ")} |`;
  const rule = `| ${columns.map((c, i) => (c.align === "right" ? "-".repeat(widths[i]! - 1) + ":" : "-".repeat(widths[i]!))).join(" | ")} |`;
  const body = rows.map((row) => `| ${row.map((cell, i) => pad(cell, i)).join(" | ")} |`);
  return [header, rule, ...body].join("\n");
}
