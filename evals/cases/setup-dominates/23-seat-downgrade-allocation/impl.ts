export type Member = { id: string; role: "owner" | "admin" | "member"; lastActiveAt: string };

export type Downgrade = { keep: string[]; deactivate: string[] };

export function planDowngrade(members: Member[], seats: number): Downgrade {
  const ranked = [...members].sort((a, b) => {
    const rank = (m: Member) => (m.role === "owner" ? 0 : m.role === "admin" ? 1 : 2);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return b.lastActiveAt.localeCompare(a.lastActiveAt);
  });
  if (seats < 1) throw new Error("at least one seat is required");
  return { keep: ranked.slice(0, seats).map((m) => m.id), deactivate: ranked.slice(seats).map((m) => m.id) };
}
