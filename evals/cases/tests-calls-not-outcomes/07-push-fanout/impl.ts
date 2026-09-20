export type Device = { token: string; platform: "ios" | "android"; mutedUntil: number | null };

export interface PushGateway {
  send(token: string, payload: { title: string; body: string; badge?: number }): Promise<void>;
}

export async function fanoutAlert(
  gateway: PushGateway,
  devices: Device[],
  alert: { title: string; body: string },
  now: number,
): Promise<number> {
  const targets = devices.filter((d) => d.mutedUntil === null || d.mutedUntil <= now);
  for (const device of targets) {
    await gateway.send(
      device.token,
      device.platform === "ios" ? { ...alert, badge: 1 } : alert,
    );
  }
  return targets.length;
}
