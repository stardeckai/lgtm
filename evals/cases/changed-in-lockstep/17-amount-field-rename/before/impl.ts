export type Expense = { id: string; amount: number; category: string };

export function reimbursable(expenses: Expense[], capPerCategory: Record<string, number>): number {
  let total = 0;
  for (const expense of expenses) {
    const cap = capPerCategory[expense.category] ?? 0;
    total += Math.min(expense.amount, cap);
  }
  return total;
}
