export type OrderEvent =
  | { type: "placed"; at: number }
  | { type: "packed"; at: number }
  | { type: "cancelled"; at: number; reason: string };

export function readEvent(raw: Record<string, unknown>): OrderEvent {
  const at = Number(raw.at);
  if (!Number.isFinite(at)) throw new Error("event needs a numeric timestamp");
  switch (raw.type) {
    case "placed":
      return { type: "placed", at };
    case "packed":
      return { type: "packed", at };
    case "cancelled":
      if (typeof raw.reason !== "string" || raw.reason.length === 0) {
        throw new Error("a cancellation must carry a reason");
      }
      return { type: "cancelled", at, reason: raw.reason };
    default:
      throw new Error(`unknown order event ${String(raw.type)}`);
  }
}

export function timelineLabels(events: OrderEvent[]): string[] {
  return events.map((event) =>
    event.type === "cancelled" ? `cancelled (${event.reason})` : event.type,
  );
}
