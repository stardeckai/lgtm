export type Doc = { id: string; tenantId: string; title: string; ownerId: string };
export type Actor = { id: string; tenantId: string; role: "member" | "admin" };

export class DocStore {
  private rows: Doc[] = [];
  insert(doc: Doc): void {
    this.rows.push(doc);
  }
  listVisible(actor: Actor): Doc[] {
    return this.rows.filter((d) => d.tenantId === actor.tenantId);
  }
  read(actor: Actor, id: string): Doc {
    const doc = this.rows.find((d) => d.id === id);
    if (!doc || doc.tenantId !== actor.tenantId) throw new Error("not_found");
    return doc;
  }
}
