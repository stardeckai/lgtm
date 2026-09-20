export type Demand = { riders: number; drivers: number; weatherPenalty: number };

const MIN_CENTS = 500;
const MAX_MULTIPLIER = 3;

export function fareCents(baseCents: number, demand: Demand): number {
  const ratio = demand.drivers === 0 ? MAX_MULTIPLIER : demand.riders / demand.drivers;
  const multiplier = Math.min(MAX_MULTIPLIER, Math.max(1, ratio + demand.weatherPenalty));
  return Math.max(MIN_CENTS, Math.round(baseCents * multiplier));
}
