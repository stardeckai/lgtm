export type Attempt = { number: number; waitedMs: number; ok: boolean };

export async function deliver(
  send: (attempt: number) => Promise<boolean>,
  sleep: (ms: number) => Promise<void>,
  maxAttempts: number,
): Promise<Attempt[]> {
  const log: Attempt[] = [];
  let waitMs = 0;
  for (let number = 1; number <= maxAttempts; number += 1) {
    if (waitMs > 0) await sleep(waitMs);
    const ok = await send(number);
    log.push({ number, waitedMs: waitMs, ok });
    if (ok) break;
    waitMs = waitMs === 0 ? 1000 : waitMs * 2;
  }
  return log;
}
