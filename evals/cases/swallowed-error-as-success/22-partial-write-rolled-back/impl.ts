export type Seat = { id: string; row: number; number: number; holderId: string | null };

export class SeatMap {
  constructor(private readonly seats: Seat[]) {}

  hold(holderId: string, seatIds: string[]): Seat[] {
    const targets = seatIds.map((id) => {
      const seat = this.seats.find((s) => s.id === id);
      if (!seat) throw new Error(`unknown seat ${id}`);
      if (seat.holderId !== null && seat.holderId !== holderId) throw new Error(`seat ${id} already held`);
      return seat;
    });
    for (const seat of targets) seat.holderId = holderId;
    return targets;
  }

  free(): string[] {
    return this.seats.filter((s) => s.holderId === null).map((s) => s.id);
  }
}
