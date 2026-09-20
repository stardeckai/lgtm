export type Zone = { name: string; setpointC: number; occupied: boolean };

const MIN_C = 5;
const MAX_C = 30;

export function setSetpoint(zone: Zone, requestedC: number): Zone {
  if (!zone.occupied) return { ...zone, setpointC: 16 };
  return { ...zone, setpointC: Math.min(MAX_C, Math.max(MIN_C, requestedC)) };
}
