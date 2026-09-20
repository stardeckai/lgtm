export function jitteredDelayMs(attempt: number, seed: number): number {
  const base = 1000 * 2 ** (attempt - 1);
  const spread = (seed * 9301 + 49297) % 233280;
  return base + Math.floor((spread / 233280) * base * 0.5);
}

export function schedule(attempts: number, seed: number): number[] {
  return Array.from({ length: attempts }, (_, i) => jitteredDelayMs(i + 1, seed + i));
}
