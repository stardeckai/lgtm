export type LegacyUser = { id: number; full_name: string; email: string; created: string; flags: number };
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  isSuspended: boolean;
};

export function migrateUsers(rows: LegacyUser[]): User[] {
  return rows.map((row) => {
    const [firstName, ...rest] = row.full_name.trim().split(/\s+/);
    return {
      id: `usr_${row.id}`,
      firstName: firstName ?? "",
      lastName: rest.join(" "),
      email: row.email.toLowerCase(),
      createdAt: new Date(`${row.created}T00:00:00Z`).toISOString(),
      isAdmin: (row.flags & 1) === 1,
      isSuspended: (row.flags & 2) === 2,
    };
  });
}
