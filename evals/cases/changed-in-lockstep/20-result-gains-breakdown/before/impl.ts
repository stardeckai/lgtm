export type Stay = { nights: number; nightlyCents: number; cleaningCents: number };

export function stayTotalCents(stay: Stay): number {
  return stay.nights * stay.nightlyCents + stay.cleaningCents;
}
