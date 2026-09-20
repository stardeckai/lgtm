export type Deps = { db: () => Promise<boolean>; queueDepth: () => Promise<number> };

export type HealthResponse = { status: number; body: { ok: boolean; checks: Record<string, string> } };

export async function healthHandler(deps: Deps): Promise<HealthResponse> {
  const checks: Record<string, string> = {};
  try {
    checks.database = (await deps.db()) ? "up" : "down";
  } catch {
    checks.database = "down";
  }
  checks.queue = (await deps.queueDepth()) > 10_000 ? "saturated" : "up";
  const ok = checks.database === "up" && checks.queue === "up";
  return { status: ok ? 200 : 503, body: { ok, checks } };
}
