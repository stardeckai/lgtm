export type Workspace = { id: string; plan: "free" | "team"; seats: number };

const FREE_SEAT_LIMIT = 3;

export function canAddSeat(workspace: Workspace): { allowed: boolean; reason?: string } {
  if (workspace.plan === "team") return { allowed: true };
  if (workspace.seats >= FREE_SEAT_LIMIT) return { allowed: false, reason: "seat limit reached" };
  return { allowed: true };
}
