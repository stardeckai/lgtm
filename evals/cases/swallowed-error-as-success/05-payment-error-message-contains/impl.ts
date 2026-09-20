export type Card = { number: string; expMonth: number; expYear: number; cvc: string };

export function authorizeCard(card: Card, amountCents: number, nowYear: number): string {
  if (amountCents <= 0) throw new Error("amount must be positive");
  if (card.expYear < nowYear) throw new Error("card expired: renew before charging");
  if (card.cvc.length !== 3) throw new Error("cvc must be three digits");
  return `auth_${card.number.slice(-4)}_${amountCents}`;
}
