export type Membership = { userId: string; orgId: string; role: "viewer" | "admin" };
export type Document = { id: string; orgId: string; title: string; visibility: "org" | "private"; ownerId: string };

export class DocumentTable {
  constructor(private readonly rows: Document[]) {}
  all(): Document[] {
    return this.rows;
  }
}

export function visibleDocuments(
  table: DocumentTable,
  membership: Membership | null,
): Document[] {
  if (!membership) return [];
  return table
    .all()
    .filter((d) => d.orgId === membership.orgId)
    .filter((d) => d.visibility === "org" || d.ownerId === membership.userId || membership.role === "admin");
}
