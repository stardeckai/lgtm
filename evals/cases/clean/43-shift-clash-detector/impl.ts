export type Assignment = { staffId: string; startMin: number; endMin: number; role: string };

export type Clash =
  | { kind: "overlap"; staffId: string; a: string; b: string }
  | { kind: "rest"; staffId: string; gapMin: number };

const MIN_REST_MIN = 11 * 60;

export function findClashes(assignments: Assignment[]): Clash[] {
  const clashes: Clash[] = [];
  const byStaff = new Map<string, Assignment[]>();
  for (const assignment of assignments) {
    const list = byStaff.get(assignment.staffId) ?? [];
    list.push(assignment);
    byStaff.set(assignment.staffId, list);
  }
  for (const [staffId, list] of byStaff) {
    const sorted = [...list].sort((a, b) => a.startMin - b.startMin);
    for (let i = 1; i < sorted.length; i++) {
      const previous = sorted[i - 1]!;
      const current = sorted[i]!;
      if (current.startMin < previous.endMin) {
        clashes.push({ kind: "overlap", staffId, a: previous.role, b: current.role });
        continue;
      }
      const gap = current.startMin - previous.endMin;
      if (gap < MIN_REST_MIN) clashes.push({ kind: "rest", staffId, gapMin: gap });
    }
  }
  return clashes;
}
