export type AccountNames = {
  displayName?: string | null;
  companyName: string;
};

/** The optional display name wins; a blank one falls back to the legal company name. */
export function getAccountDisplayName(account: AccountNames): string {
  const trimmed = account.displayName?.trim();
  return trimmed ? trimmed : account.companyName;
}
