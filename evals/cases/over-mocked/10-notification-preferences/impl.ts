import { preferenceStore } from "./preference-store";
import { channelRegistry } from "./channel-registry";
import { renderTemplate } from "./templates";

export type Alert = { kind: "invoice.due" | "deploy.failed"; userId: string; data: Record<string, string> };

export const DEFAULT_CHANNELS: Record<Alert["kind"], string[]> = {
  "invoice.due": ["email"],
  "deploy.failed": ["email", "line"],
};

export async function notify(alert: Alert): Promise<string[]> {
  const prefs = await preferenceStore.get(alert.userId);
  const channels = prefs?.[alert.kind] ?? DEFAULT_CHANNELS[alert.kind];
  const body = renderTemplate(alert.kind, alert.data);
  const delivered: string[] = [];
  for (const channel of channels) {
    const transport = channelRegistry.get(channel);
    if (!transport) continue;
    await transport.send(alert.userId, body);
    delivered.push(channel);
  }
  return delivered;
}
