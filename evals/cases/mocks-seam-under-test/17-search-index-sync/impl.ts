export type Article = { id: string; title: string; body: string; published: boolean };

export interface ArticleRepository {
  save(article: Article): Promise<void>;
  byId(id: string): Promise<Article | null>;
}

export interface SearchIndex {
  upsert(doc: { id: string; text: string }): Promise<void>;
  remove(id: string): Promise<void>;
  search(term: string): Promise<string[]>;
}

export async function saveArticle(
  repo: ArticleRepository,
  index: SearchIndex,
  article: Article,
): Promise<void> {
  await repo.save(article);
  if (article.published) {
    await index.upsert({ id: article.id, text: `${article.title} ${article.body}` });
  } else {
    await index.remove(article.id);
  }
}
