export type Evidence =
  | { kind: "image"; src: string }
  | { kind: "acceptance"; channel: string; locale: string; acceptedAt: string }
  | { kind: "text"; text: string }
  | { kind: "empty" };

const BARE_BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

/**
 * Stored evidence is one of: a signature-pad data URL, a JSON acceptance
 * envelope, historical bare base64, or a typed name. A malformed envelope is
 * shown as the literal text it is, never dropped and never thrown on.
 */
export function describeEvidence(stored: string | null): Evidence {
  if (!stored || !stored.trim()) return { kind: "empty" };
  if (stored.startsWith("data:image/")) return { kind: "image", src: stored };
  if (stored.startsWith("{")) {
    try {
      const parsed = JSON.parse(stored) as Record<string, unknown>;
      return {
        kind: "acceptance",
        channel: String(parsed.channel),
        locale: String(parsed.locale),
        acceptedAt: String(parsed.acceptedAt),
      };
    } catch {
      return { kind: "text", text: stored };
    }
  }
  if (stored.length > 64 && BARE_BASE64.test(stored)) {
    return { kind: "image", src: `data:image/png;base64,${stored}` };
  }
  return { kind: "text", text: stored };
}
