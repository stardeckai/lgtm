export type Customer = { id: string; lifetimeCents: number };

export function discountPercent(customer: Customer, orderCents: number): number {
  let percent = 0;
  if (customer.lifetimeCents >= 5_000_00) percent += 5;
  if (customer.lifetimeCents >= 25_000_00) percent += 5;
  if (orderCents >= 500_00) percent += 3;
  return Math.min(percent, 12);
}

export function payableCents(customer: Customer, orderCents: number): number {
  const percent = discountPercent(customer, orderCents);
  return orderCents - Math.floor((orderCents * percent) / 100);
}
