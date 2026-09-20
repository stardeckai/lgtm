export type NotificationSettings = { digest: "daily" | "weekly" | "off"; channels: string[] };

const DEFAULTS: NotificationSettings = { digest: "weekly", channels: ["email"] };

export function saveSettings(settings: NotificationSettings): string {
  if (settings.channels.length === 0) throw new Error("at least one channel required");
  return JSON.stringify(settings);
}

export function readSettings(stored: string | null): NotificationSettings {
  if (!stored) return DEFAULTS;
  try {
    const parsed = JSON.parse(stored) as Partial<NotificationSettings>;
    const digest =
      parsed.digest === "daily" || parsed.digest === "weekly" || parsed.digest === "off"
        ? parsed.digest
        : DEFAULTS.digest;
    const channels = Array.isArray(parsed.channels) && parsed.channels.length > 0 ? parsed.channels : DEFAULTS.channels;
    return { digest, channels };
  } catch {
    return DEFAULTS;
  }
}
