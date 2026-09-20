export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  notes: string;
};

const COLUMNS: (keyof Contact)[] = [
  "id", "firstName", "lastName", "company", "title", "email", "phone", "city", "country", "notes",
];

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function toCsv(contacts: Contact[]): string {
  const header = COLUMNS.join(",");
  const rows = contacts.map((contact) => COLUMNS.map((column) => escapeCell(contact[column])).join(","));
  return [header, ...rows].join("\n");
}
