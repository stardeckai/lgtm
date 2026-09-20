export type Wallet = { id: string; currency: string; balanceMinor: number };

export function transfer(from: Wallet, to: Wallet, amountMinor: number): [Wallet, Wallet] {
  if (amountMinor <= 0) throw new RangeError("amount must be positive");
  if (from.currency !== to.currency) throw new TypeError("currency mismatch");
  if (from.balanceMinor < amountMinor) throw new RangeError("insufficient funds");
  return [
    { ...from, balanceMinor: from.balanceMinor - amountMinor },
    { ...to, balanceMinor: to.balanceMinor + amountMinor },
  ];
}
