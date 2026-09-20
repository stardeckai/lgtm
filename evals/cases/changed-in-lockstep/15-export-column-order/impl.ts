export type Contact = { id: string; email: string; fullName: string; createdAt: string };

const COLUMNS = ["id", "full_name", "email", "created_at"] as const;

export function exportHeader(): string {
  return COLUMNS.join(",");
}

export function exportRow(contact: Contact): string {
  return [contact.id, contact.fullName, contact.email, contact.createdAt].join(",");
}
