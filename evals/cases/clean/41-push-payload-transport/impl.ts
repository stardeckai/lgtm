export type Device = { token: string; platform: "ios" | "android"; locale: string };
export type Notification = { titleKey: string; bodyKey: string; args: Record<string, string>; badge?: number };

const STRINGS: Record<string, Record<string, string>> = {
  en: { "order.shipped.title": "On its way", "order.shipped.body": "Order {id} left the warehouse" },
  de: { "order.shipped.title": "Unterwegs", "order.shipped.body": "Bestellung {id} hat das Lager verlassen" },
};

function render(locale: string, key: string, args: Record<string, string>): string {
  const template = STRINGS[locale]?.[key] ?? STRINGS["en"]![key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => args[name] ?? `{${name}}`);
}

export type Sender = (envelope: Record<string, unknown>) => Promise<void>;

export async function push(send: Sender, device: Device, notification: Notification): Promise<void> {
  const title = render(device.locale, notification.titleKey, notification.args);
  const body = render(device.locale, notification.bodyKey, notification.args);
  const envelope =
    device.platform === "ios"
      ? { token: device.token, aps: { alert: { title, body }, badge: notification.badge ?? 0 } }
      : { token: device.token, notification: { title, body }, data: notification.args };
  await send(envelope);
}
