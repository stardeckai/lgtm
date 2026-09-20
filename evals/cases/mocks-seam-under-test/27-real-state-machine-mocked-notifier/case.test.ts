import { describe, expect, it, vi } from "vitest";
import { Expense, InvalidTransition, transition, type Notifier } from "./impl";

const notifier: Notifier = { notify: vi.fn().mockResolvedValue(undefined) };

describe("transition", () => {
  it("refuses to pay an expense that skipped approval and leaves its history untouched", async () => {
    const expense = new Expense();

    await expect(transition(expense, notifier, "paid")).rejects.toBeInstanceOf(InvalidTransition);
    expect(expense.status).toBe("draft");
    expect(expense.history).toEqual(["draft"]);
    expect(notifier.notify).not.toHaveBeenCalled();

    await transition(expense, notifier, "submitted");
    await transition(expense, notifier, "approved");
    expect(expense.history).toEqual(["draft", "submitted", "approved"]);
  });
});
