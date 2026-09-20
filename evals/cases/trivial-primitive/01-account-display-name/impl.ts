export type Account = { firstName: string; lastName: string; email: string };

export function displayName(account: Account): string {
  return `${account.firstName} ${account.lastName}`;
}
