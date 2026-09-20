export type SeatRequest = { orgId: string; requested: number; licensed: number; used: number };

export class SeatLimitError extends Error {
  constructor(readonly orgId: string, readonly available: number) {
    super(`org ${orgId} has ${available} seat(s) available`);
    this.name = "SeatLimitError";
  }
}

export function reserveSeats(request: SeatRequest): number {
  if (request.requested <= 0) throw new RangeError("requested must be positive");
  const available = request.licensed - request.used;
  if (request.requested > available) throw new SeatLimitError(request.orgId, available);
  return request.used + request.requested;
}
