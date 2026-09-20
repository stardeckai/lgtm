export type Article = {
  id: string;
  title: string;
  body: string;
  status: "draft" | "published" | "archived";
  tags: string[];
};

export interface SearchIndex {
  upsert(doc: { id: string; title: string; excerpt: string; tags: string[] }): Promise<void>;
  remove(id: string): Promise<void>;
}

export async function syncArticle(index: SearchIndex, article: Article): Promise<"indexed" | "removed"> {
  if (article.status !== "published") {
    await index.remove(article.id);
    return "removed";
  }
  await index.upsert({
    id: article.id,
    title: article.title,
    excerpt: article.body.slice(0, 160),
    tags: article.tags.map((t) => t.toLowerCase()),
  });
  return "indexed";
}
