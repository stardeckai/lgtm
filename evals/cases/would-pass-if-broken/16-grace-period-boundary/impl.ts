export type Loan = { principalCents: number; daysLate: number; hardship: boolean };

const GRACE_DAYS = 30;
const DAILY_RATE = 0.0004;

export function penaltyCents(loan: Loan): number {
  if (loan.hardship) return 0;
  if (loan.daysLate <= GRACE_DAYS) return 0;
  const chargeableDays = loan.daysLate - GRACE_DAYS;
  return Math.round(loan.principalCents * DAILY_RATE * chargeableDays);
}
