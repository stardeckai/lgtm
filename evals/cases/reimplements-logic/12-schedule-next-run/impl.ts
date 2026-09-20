export type Schedule = { startIso: string; everyMinutes: number; skipWeekends: boolean };

export function nextRunAt(schedule: Schedule, afterIso: string): string {
  const start = Date.parse(schedule.startIso);
  const after = Date.parse(afterIso);
  const stepMs = schedule.everyMinutes * 60_000;
  const elapsedSteps = Math.max(0, Math.ceil((after - start) / stepMs));
  let candidate = new Date(start + elapsedSteps * stepMs);
  if (candidate.getTime() <= after) candidate = new Date(candidate.getTime() + stepMs);
  while (schedule.skipWeekends && (candidate.getUTCDay() === 0 || candidate.getUTCDay() === 6)) {
    candidate = new Date(candidate.getTime() + stepMs);
  }
  return candidate.toISOString();
}
