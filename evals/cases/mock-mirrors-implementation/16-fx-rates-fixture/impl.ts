export interface RateFeed {
  latest(base: string): Promise<Record<string, number>>;
}

export type Expense = { id: string; currency: string; minorUnits: number };

export async function reimbursementUsdCents(feed: RateFeed, expenses: Expense[]): Promise<number> {
  const rates = await feed.latest("USD");
  let total = 0;
  for (const expense of expenses) {
    if (expense.currency === "USD") {
      total += expense.minorUnits;
      continue;
    }
    const rate = rates[expense.currency];
    if (rate === undefined) throw new Error(`no USD rate for ${expense.currency}`);
    total += Math.round(expense.minorUnits / rate);
  }
  return total;
}
