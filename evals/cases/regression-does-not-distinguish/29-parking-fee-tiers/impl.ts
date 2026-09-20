export function parkingFeeCents(minutes: number): number {
  if (minutes <= 15) return 0;
  const hours = Math.ceil(minutes / 60);
  return Math.min(1500, 200 + (hours - 1) * 150);
}
