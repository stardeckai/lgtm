import { describe, expect, it } from "vitest";
import { reimbursable, type Expense } from "./impl";

describe("reimbursable", () => {
  it("pays each expense only up to its category cap", () => {
    const expenses: Expense[] = [
      { id: "e1", amountCents: 12000, category: "travel" },
      { id: "e2", amountCents: 3000, category: "meals" },
      { id: "e3", amountCents: 500, category: "other" },
    ];

    expect(reimbursable(expenses, { travel: 10000, meals: 5000 })).toBe(13000);
  });
});
