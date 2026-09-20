export type Status = "draft" | "submitted" | "approved" | "rejected" | "paid";

const ALLOWED: Record<Status, Status[]> = {
  draft: ["submitted"],
  submitted: ["approved", "rejected"],
  approved: ["paid"],
  rejected: ["draft"],
  paid: [],
};

export class InvalidTransition extends Error {
  constructor(from: Status, to: Status) {
    super(`cannot move from ${from} to ${to}`);
  }
}

export class Expense {
  readonly history: Status[] = [];
  constructor(public status: Status = "draft") {
    this.history.push(status);
  }
  moveTo(next: Status): void {
    if (!ALLOWED[this.status].includes(next)) throw new InvalidTransition(this.status, next);
    this.status = next;
    this.history.push(next);
  }
}

export interface Notifier {
  notify(event: string, status: Status): Promise<void>;
}

export async function transition(expense: Expense, notifier: Notifier, next: Status): Promise<Status> {
  expense.moveTo(next);
  await notifier.notify("expense.status_changed", next);
  return expense.status;
}
