/**
 * A deposit may never exceed the amount owed. Both arguments arrive from
 * operator input and from upstream quotes, so an invalid amount is refused
 * rather than coerced — a coerced NaN used to become a zero-value deposit.
 */
export function clampDepositToTotal(depositCents: number, totalCents: number): number {
  if (!Number.isFinite(depositCents) || depositCents < 0) {
    throw new Error("Invalid deposit amount");
  }
  if (!Number.isFinite(totalCents) || totalCents < 0) {
    throw new Error("Invalid total amount");
  }
  return Math.min(Math.round(depositCents), Math.round(totalCents));
}
