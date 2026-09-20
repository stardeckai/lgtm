export type Account = { email: string; passwordHash: string; deletedAt: number | null };

export class Accounts {
  private byEmail = new Map<string, Account>();

  add(account: Account): void {
    this.byEmail.set(account.email.toLowerCase(), account);
  }

  authenticate(email: string, passwordHash: string): Account | null {
    const account = this.byEmail.get(email.toLowerCase());
    if (!account) return null;
    if (account.deletedAt !== null) return null;
    if (account.passwordHash !== passwordHash) return null;
    return account;
  }
}
