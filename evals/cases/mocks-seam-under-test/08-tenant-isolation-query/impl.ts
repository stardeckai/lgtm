export type DocumentRow = { id: string; tenantId: string; title: string; deletedAt: string | null };

export interface DocumentGateway {
  selectDocuments(tenantId: string, search: string): Promise<DocumentRow[]>;
}

export class PostgresDocumentGateway implements DocumentGateway {
  constructor(private readonly all: DocumentRow[]) {}
  async selectDocuments(tenantId: string, search: string): Promise<DocumentRow[]> {
    return this.all.filter(
      (row) =>
        row.tenantId === tenantId &&
        row.deletedAt === null &&
        row.title.toLowerCase().includes(search.toLowerCase()),
    );
  }
}

export async function searchDocuments(
  gateway: DocumentGateway,
  tenantId: string,
  search: string,
): Promise<string[]> {
  const rows = await gateway.selectDocuments(tenantId, search);
  return rows.map((row) => row.title);
}
