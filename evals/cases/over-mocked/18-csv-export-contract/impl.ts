export type Row = { name: string; email: string; notes: string; totalCents: number };

export interface Uploader {
  upload(key: string, body: string): Promise<{ url: string }>;
}

export function toCsv(rows: Row[]): string {
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const header = "name,email,notes,total";
  const lines = rows.map((r) =>
    [escape(r.name), escape(r.email), escape(r.notes), (r.totalCents / 100).toFixed(2)].join(","),
  );
  return [header, ...lines].join("\n");
}

export async function exportCustomers(uploader: Uploader, orgId: string, rows: Row[]): Promise<string> {
  const { url } = await uploader.upload(`exports/${orgId}/customers.csv`, toCsv(rows));
  return url;
}
