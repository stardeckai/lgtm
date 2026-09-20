export type Booking = { room: string; startMinute: number; endMinute: number };

export class BookingCalendar {
  private bookings: Booking[] = [];

  book(booking: Booking): void {
    if (booking.endMinute <= booking.startMinute) throw new Error("booking must end after it starts");
    const clash = this.bookings.some(
      (existing) =>
        existing.room === booking.room &&
        booking.startMinute < existing.endMinute &&
        existing.startMinute < booking.endMinute,
    );
    if (clash) throw new Error(`${booking.room} is already booked at that time`);
    this.bookings.push(booking);
  }

  seedRaw(bookings: Booking[]): void {
    this.bookings.push(...bookings);
  }

  bookedMinutes(room: string): number {
    return this.bookings
      .filter((booking) => booking.room === room)
      .reduce((sum, booking) => sum + (booking.endMinute - booking.startMinute), 0);
  }

  nextFreeMinute(room: string, from: number, durationMinutes: number): number {
    let candidate = from;
    for (const booking of this.bookings
      .filter((b) => b.room === room)
      .sort((a, b) => a.startMinute - b.startMinute)) {
      if (candidate + durationMinutes <= booking.startMinute) return candidate;
      candidate = Math.max(candidate, booking.endMinute);
    }
    return candidate;
  }
}
