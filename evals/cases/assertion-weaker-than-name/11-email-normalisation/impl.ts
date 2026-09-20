export function canonicalEmail(raw: string): string {
  const [localPart = "", domain = ""] = raw.trim().toLowerCase().split("@");
  if (domain === "gmail.com") {
    const withoutTag = localPart.split("+")[0] ?? "";
    return `${withoutTag.replace(/\./g, "")}@${domain}`;
  }
  return `${localPart}@${domain}`;
}

export class SignupList {
  private taken = new Set<string>();

  register(email: string): boolean {
    const key = canonicalEmail(email);
    if (this.taken.has(key)) return false;
    this.taken.add(key);
    return true;
  }
}
