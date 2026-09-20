export type ContactRow = { email: string; name: string };
export type ImportReport = { imported: number; rejected: { line: number; reason: string }[] };

export function importContacts(
  lines: string[],
  existing: Set<string>,
  imported: ContactRow[] = [],
): ImportReport {
  const report: ImportReport = { imported: 0, rejected: [] };
  lines.forEach((line, index) => {
    const [email, name] = line.split(",");
    if (!email || !email.includes("@")) {
      report.rejected.push({ line: index + 1, reason: "invalid email" });
      return;
    }
    if (existing.has(email)) {
      report.rejected.push({ line: index + 1, reason: "duplicate" });
      return;
    }
    existing.add(email);
    imported.push({ email, name: name ?? "" });
    report.imported += 1;
  });
  return report;
}
