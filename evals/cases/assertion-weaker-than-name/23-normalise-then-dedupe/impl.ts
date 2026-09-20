export function canonicalEmail(raw: string): string {
  const [localPart = "", domain = ""] = raw.trim().toLowerCase().split("@");
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const withoutTag = localPart.split("+")[0] ?? "";
    return `${withoutTag.replace(/\./g, "")}@gmail.com`;
  }
  return `${localPart}@${domain}`;
}

export class Waitlist {
  private taken = new Set<string>();

  join(email: string): boolean {
    const key = canonicalEmail(email);
    if (this.taken.has(key)) return false;
    this.taken.add(key);
    return true;
  }
}
