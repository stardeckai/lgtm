export type Entry = { playerId: string; score: number; finishedAtMs: number };

export function leaderboard(entries: Entry[], top: number): string[] {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.finishedAtMs - b.finishedAtMs;
    })
    .slice(0, top)
    .map((entry) => entry.playerId);
}
