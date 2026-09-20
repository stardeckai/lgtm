export type Hit = { id: string; score: number };
export type SearchClient = { query(term: string): Promise<Hit[]> };

export class SearchFacade {
  constructor(
    private readonly client: SearchClient,
    private readonly cache: Map<string, Hit[]>,
  ) {}

  async search(term: string): Promise<Hit[]> {
    try {
      const hits = await this.client.query(term);
      const ranked = hits.sort((a, b) => b.score - a.score).slice(0, 10);
      this.cache.set(term, ranked);
      return ranked;
    } catch {
      return this.cache.get(term) ?? [];
    }
  }
}
