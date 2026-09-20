export type Attendee = { fullName: string; status: "booked" | "cancelled" };

export type BookingRow = {
  id: string;
  partySize: number;
  attendees: Attendee[];
  createdAt: string;
};

/** Cancelled attendees stay visible so the desk can see who dropped out. */
export function partySummary(booking: BookingRow): string {
  if (!booking.partySize) return "";
  const heading = `${booking.partySize} guests`;
  if (!booking.attendees?.length) return `${heading} — open booking for attendee details`;
  const names = booking.attendees
    .map((a) => (a.status === "cancelled" ? `${a.fullName} (cancelled)` : a.fullName))
    .join(" · ");
  return `${heading} — ${names}`;
}
