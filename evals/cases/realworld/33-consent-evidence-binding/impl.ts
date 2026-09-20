export type ConsentEvidence = { requestId: string; bookingId: string; acceptedAt: string };

export interface ConsentStore {
  verify(requestId: string): Promise<boolean>;
  bind(evidence: { requestId: string; bookingId: string }): Promise<void>;
}

export interface BookingEngine {
  createBooking(quoteToken: string): Promise<{ bookingId: string }>;
  cancelBooking(bookingId: string): Promise<void>;
}

export type BookingResult = { status: number; code?: string; bookingId?: string };

export async function bookWithConsent(
  store: ConsentStore,
  engine: BookingEngine,
  input: { quoteToken: string; consentRequestId: string | null },
): Promise<BookingResult> {
  if (!input.consentRequestId) return { status: 409, code: "CONSENT_REQUIRED" };
  if (!(await store.verify(input.consentRequestId))) return { status: 409, code: "CONSENT_INVALID" };

  const { bookingId } = await engine.createBooking(input.quoteToken);
  try {
    await store.bind({ requestId: input.consentRequestId, bookingId });
  } catch {
    await engine.cancelBooking(bookingId);
    return { status: 409, code: "CONSENT_BIND_FAILED" };
  }
  return { status: 200, bookingId };
}
