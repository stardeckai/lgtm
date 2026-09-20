export type Job = { id: string; kind: string; attempts: number; tenantPlan: string };

const BASE: Record<string, number> = { deploy: 10, email: 50, report: 80, cleanup: 95 };

export function priorityOf(job: Job): number {
  const base = BASE[job.kind] ?? 60;
  const planBoost = job.tenantPlan === "enterprise" ? -15 : 0;
  const retryPenalty = Math.min(job.attempts * 5, 20);
  return Math.max(1, Math.min(100, base + planBoost + retryPenalty));
}
