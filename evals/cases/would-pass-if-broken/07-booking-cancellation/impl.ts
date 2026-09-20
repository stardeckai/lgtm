export type Booking = {
  id: string;
  status: "confirmed" | "cancelled";
  priceCents: number;
  startsAt: number;
  refundCents: number;
};

const FULL_REFUND_WINDOW_MS = 48 * 60 * 60 * 1000;

export function cancelBooking(booking: Booking, nowMs: number): Booking {
  const lead = booking.startsAt - nowMs;
  const refundCents =
    lead >= FULL_REFUND_WINDOW_MS ? booking.priceCents : Math.round(booking.priceCents / 2);
  return { ...booking, status: "cancelled", refundCents };
}
