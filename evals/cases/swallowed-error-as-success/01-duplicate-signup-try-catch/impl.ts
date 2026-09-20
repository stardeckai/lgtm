export type Account = { id: string; email: string };

export class AccountService {
  private byEmail = new Map<string, Account>();
  private sequence = 0;

  register(email: string): Account {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) throw new Error("invalid_email");
    if (this.byEmail.has(normalized)) throw new Error("email_taken");
    this.sequence += 1;
    const account = { id: `acc_${this.sequence}`, email: normalized };
    this.byEmail.set(normalized, account);
    return account;
  }
}
