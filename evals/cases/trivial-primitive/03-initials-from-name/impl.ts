export type Contact = { fullName: string; email: string; company: string };

export function initials(contact: Contact): string {
  return contact.fullName
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("");
}

export function contactCard(contact: Contact): { initials: string; subtitle: string } {
  return { initials: initials(contact), subtitle: `${contact.company} · ${contact.email}` };
}
