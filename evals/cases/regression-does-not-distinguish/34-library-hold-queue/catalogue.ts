export type Title = { isbn: string; copies: number };

export function copiesOf(titles: Title[], isbn: string): number {
  return titles.find((t) => t.isbn === isbn)?.copies ?? 0;
}
