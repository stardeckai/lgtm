export type ApiKey = { id: string; scopes: string[]; revokedAt: number | null };

export type OrderCommand = { type: "create" | "cancel"; orderId: string };

const REQUIRED_SCOPE: Record<OrderCommand["type"], string> = {
  create: "orders:write",
  cancel: "orders:write",
};

export function runOrderCommand(key: ApiKey, command: OrderCommand, nowMs: number): string {
  if (key.revokedAt !== null && key.revokedAt <= nowMs) throw new Error("api key revoked");
  if (!key.scopes.includes(REQUIRED_SCOPE[command.type])) {
    throw new Error(`api key is missing ${REQUIRED_SCOPE[command.type]}`);
  }
  return `${command.type}:${command.orderId}`;
}
