export type SeatMap = { eventId: string; taken: string[]; version: number };

export class SeatService {
  constructor(private map: SeatMap) {}

  current(): SeatMap {
    return { ...this.map, taken: [...this.map.taken] };
  }

  claim(seat: string, expectedVersion: number): SeatMap {
    if (expectedVersion !== this.map.version) throw new Error("seat map changed, reload and retry");
    if (this.map.taken.includes(seat)) throw new Error(`${seat} is taken`);
    this.map = { ...this.map, taken: [...this.map.taken, seat], version: this.map.version + 1 };
    return this.current();
  }
}
