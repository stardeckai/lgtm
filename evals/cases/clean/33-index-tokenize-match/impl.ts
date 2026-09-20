export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1);
}

export class SearchIndex {
  private postings = new Map<string, Set<string>>();

  add(id: string, text: string): void {
    for (const token of tokenize(text)) {
      const set = this.postings.get(token) ?? new Set<string>();
      set.add(id);
      this.postings.set(token, set);
    }
  }

  query(text: string): string[] {
    const tokens = tokenize(text);
    if (tokens.length === 0) return [];
    const postings = tokens.map((token) => this.postings.get(token) ?? new Set<string>());
    const [first, ...rest] = postings;
    const matches = [...first!].filter((id) => rest.every((hits) => hits.has(id)));
    return matches.sort();
  }
}
