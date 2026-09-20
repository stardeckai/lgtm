export type Deps = { db: () => Promise<boolean>; queueDepth: () => Promise<number> };

export type HealthResponse = { status: number; body: { ok: boolean; checks: Record<string, string> } };

export async function healthHandler(deps: Deps): Promise<HealthResponse> {
  const checks: Record<string, string> = {};
  let ok = true;
  try {
    checks.database = (await deps.db()) ? "up" : "down";
  } catch {
    checks.database = "down";
  }
  const depth = await deps.queueDepth();
  checks.queue = depth > 10_000 ? "saturated" : "up";
  ok = checks.database === "up" && checks.queue === "up";
  return { status: ok ? 200 : 503, body: { ok, checks } };
}
