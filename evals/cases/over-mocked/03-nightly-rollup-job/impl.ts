import { metrics } from "./metrics";
import { warehouse } from "./warehouse";
import { slack } from "./slack";
import { lock } from "./lock";

export async function runNightlyRollup(day: string): Promise<{ rows: number; skipped: boolean }> {
  const held = await lock.acquire(`rollup:${day}`);
  if (!held) return { rows: 0, skipped: true };
  try {
    const rows = await warehouse.rollup(day);
    metrics.gauge("rollup.rows", rows);
    if (rows === 0) await slack.post("#data", `No rows rolled up for ${day}`);
    return { rows, skipped: false };
  } finally {
    await lock.release(`rollup:${day}`);
  }
}
