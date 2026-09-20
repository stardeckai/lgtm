const SENSITIVE = ["password", "token", "cardNumber"];

export type AuditEntry = { actor: string; action: string; payload: Record<string, unknown> };

export function redact(payload: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE.includes(key)) out[key] = "[redacted]";
    else if (value && typeof value === "object" && !Array.isArray(value)) out[key] = redact(value as Record<string, unknown>);
    else out[key] = value;
  }
  return out;
}

export class AuditLog {
  private entries: AuditEntry[] = [];

  record(actor: string, action: string, payload: Record<string, unknown>): void {
    this.entries.push({ actor, action, payload: redact(payload) });
  }

  forActor(actor: string): AuditEntry[] {
    return this.entries.filter((e) => e.actor === actor);
  }
}
