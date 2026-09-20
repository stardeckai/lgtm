export type Doc = { id: string; title: string; archived: boolean; updatedAt: number };

export function visibleDocuments(docs: Doc[], query: string): Doc[] {
  const needle = query.trim().toLowerCase();
  return docs
    .filter((doc) => !doc.archived)
    .filter((doc) => (needle === "" ? true : doc.title.toLowerCase().includes(needle)))
    .sort((a, b) => b.updatedAt - a.updatedAt);
}
