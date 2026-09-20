export type Seat = { row: string; number: number; heldBy: string | null };

export class SeatMap {
  private seats = new Map<string, Seat>();

  add(seat: Seat): void {
    this.seats.set(`${seat.row}${seat.number}`, seat);
  }

  claim(row: string, number: number, userId: string): boolean {
    const seat = this.seats.get(`${row}${number}`);
    if (!seat) return false;
    if (seat.heldBy !== null) return seat.heldBy === userId;
    seat.heldBy = userId;
    return true;
  }

  holderOf(row: string, number: number): string | null {
    return this.seats.get(`${row}${number}`)?.heldBy ?? null;
  }
}
