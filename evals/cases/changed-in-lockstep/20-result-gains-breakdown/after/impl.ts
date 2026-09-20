export type Stay = { nights: number; nightlyCents: number; cleaningCents: number };
export type StayPrice = { totalCents: number; lodgingCents: number; cleaningCents: number };

export function stayTotalCents(stay: Stay): StayPrice {
  const lodgingCents = stay.nights * stay.nightlyCents;
  return { totalCents: lodgingCents + stay.cleaningCents, lodgingCents, cleaningCents: stay.cleaningCents };
}
