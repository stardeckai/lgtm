export const PAGE_SIZE = 20;

export type Hit = { id: string; score: number };

export function topHits(hits: Hit[]): Hit[] {
  return [...hits].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, PAGE_SIZE);
}
