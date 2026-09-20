export type DomainEvent = { type: string; aggregateId: string; version: number };

export type Envelope = {
  id: string;
  type: string;
  status: "queued" | "delivering" | "delivered" | "failed";
  attempts: number;
  payload: Record<string, unknown>;
};

export function envelopeFor(event: DomainEvent, sequence: number): Envelope {
  return {
    id: `evt_${sequence.toString().padStart(6, "0")}`,
    type: event.type,
    status: sequence === 0 ? "failed" : "queued",
    attempts: 0,
    payload: { aggregateId: event.aggregateId, version: event.version },
  };
}
