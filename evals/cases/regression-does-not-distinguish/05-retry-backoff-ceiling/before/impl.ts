export function backoffMs(attempt: number): number {
  if (attempt < 1) throw new RangeError("attempt starts at 1");
  return 1000 * 2 ** (attempt - 1);
}

export function retrySchedule(attempts: number): number[] {
  return Array.from({ length: attempts }, (_, i) => backoffMs(i + 1));
}
