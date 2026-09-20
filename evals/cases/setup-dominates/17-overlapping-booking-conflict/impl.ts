export type Slot = { startMinute: number; endMinute: number };
export type Booking = { id: string; roomId: string; day: string } & Slot;

export function conflicts(existing: Booking[], candidate: Omit<Booking, "id">, bufferMinutes: number): Booking[] {
  return existing.filter(
    (b) =>
      b.roomId === candidate.roomId &&
      b.day === candidate.day &&
      candidate.startMinute - bufferMinutes < b.endMinute &&
      b.startMinute < candidate.endMinute + bufferMinutes,
  );
}
