export function lateFeeCents(daysOverdue: number, balanceCents: number): number {
  if (daysOverdue < 5) return 0;
  return Math.round(balanceCents * 0.015);
}
