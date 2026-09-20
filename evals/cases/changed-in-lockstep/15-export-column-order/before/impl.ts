export type Contact = { id: string; email: string; fullName: string; createdAt: string };

const COLUMNS = ["id", "email", "full_name", "created_at"] as const;

export function exportHeader(): string {
  return COLUMNS.join(",");
}

export function exportRow(contact: Contact): string {
  return [contact.id, contact.email, contact.fullName, contact.createdAt].join(",");
}
