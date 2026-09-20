export type Event = { id: string; sentAtSeconds: number };

const TOLERANCE_SECONDS = 600;

export function acceptEvent(event: Event, nowSeconds: number, seen: Set<string>): { accepted: boolean; reason?: string } {
  if (seen.has(event.id)) return { accepted: false, reason: "duplicate" };
  if (Math.abs(nowSeconds - event.sentAtSeconds) > TOLERANCE_SECONDS) {
    return { accepted: false, reason: "outside tolerance" };
  }
  seen.add(event.id);
  return { accepted: true };
}
