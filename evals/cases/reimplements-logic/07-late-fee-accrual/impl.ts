export type Rental = { id: string; dueOn: string; returnedOn: string; dailyFeeCents: number };

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_FEE_CENTS = 4000;

export function lateFeeCents(rental: Rental): number {
  const due = Date.parse(rental.dueOn);
  const returned = Date.parse(rental.returnedOn);
  const lateDays = Math.max(0, Math.floor((returned - due) / DAY_MS));
  let fee = 0;
  for (let day = 1; day <= lateDays; day += 1) {
    fee += day > 7 ? rental.dailyFeeCents * 2 : rental.dailyFeeCents;
  }
  return Math.min(fee, MAX_FEE_CENTS);
}
