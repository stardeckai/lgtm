export type Doc = { id: string; orgId: string; title: string };

export class DocIndex {
  private docs: Doc[] = [];

  add(doc: Doc): void {
    this.docs.push(doc);
  }

  search(orgId: string, term: string): Doc[] {
    const needle = term.toLowerCase();
    return this.docs.filter((doc) => doc.orgId === orgId && doc.title.toLowerCase().includes(needle));
  }
}
