export type Row = { id: string; email: string; orgId: string };

export interface Db {
  insert(table: string, row: Row): Promise<void>;
  select(table: string, where: Partial<Row>): Promise<Row[]>;
}

export async function inviteMember(db: Db, orgId: string, email: string): Promise<Row> {
  const normalized = email.trim().toLowerCase();
  const existing = await db.select("members", { orgId, email: normalized });
  if (existing.length > 0) return existing[0]!;
  const row: Row = { id: `m_${normalized}_${orgId}`, email: normalized, orgId };
  await db.insert("members", row);
  return row;
}
