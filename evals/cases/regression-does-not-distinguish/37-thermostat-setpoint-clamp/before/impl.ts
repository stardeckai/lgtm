export type Zone = { name: string; setpointC: number; occupied: boolean };

export function setSetpoint(zone: Zone, requestedC: number): Zone {
  if (!zone.occupied) return { ...zone, setpointC: 16 };
  return { ...zone, setpointC: requestedC };
}
