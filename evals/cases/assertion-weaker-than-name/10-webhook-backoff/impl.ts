export type Delivery = { attempt: number; delayMs: number; ok: boolean };

export async function deliver(
  send: (attempt: number) => Promise<boolean>,
  sleep: (ms: number) => Promise<void>,
  maxAttempts: number,
): Promise<Delivery[]> {
  const log: Delivery[] = [];
  let delayMs = 0;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (delayMs > 0) await sleep(delayMs);
    const ok = await send(attempt);
    log.push({ attempt, delayMs, ok });
    if (ok) break;
    delayMs = delayMs === 0 ? 1000 : delayMs * 2;
  }
  return log;
}
