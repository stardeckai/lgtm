export type Reservation = { id: string; roomId: string; from: number; to: number };

export interface ReservationRepo {
  forRoom(roomId: string): Reservation[];
  add(reservation: Reservation): void;
}

export class InMemoryReservations implements ReservationRepo {
  private rows: Reservation[] = [];
  forRoom(roomId: string): Reservation[] {
    return this.rows.filter((r) => r.roomId === roomId);
  }
  add(reservation: Reservation): void {
    this.rows.push(reservation);
  }
}

export function book(repo: ReservationRepo, reservation: Reservation): "booked" | "conflict" {
  const overlapping = repo
    .forRoom(reservation.roomId)
    .some((r) => reservation.from < r.to && r.from < reservation.to);
  if (overlapping) return "conflict";
  repo.add(reservation);
  return "booked";
}
