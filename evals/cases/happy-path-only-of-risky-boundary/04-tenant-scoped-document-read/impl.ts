export type Document = { id: string; orgId: string; title: string; body: string };

export class DocumentRepository {
  private docs: Document[] = [];

  add(doc: Document): void {
    this.docs.push(doc);
  }

  read(orgId: string, id: string): Document {
    const doc = this.docs.find((candidate) => candidate.id === id);
    if (!doc) throw new Error(`document ${id} not found`);
    if (doc.orgId !== orgId) throw new Error(`document ${id} not found`);
    return doc;
  }

  list(orgId: string): Document[] {
    return this.docs.filter((doc) => doc.orgId === orgId);
  }
}
