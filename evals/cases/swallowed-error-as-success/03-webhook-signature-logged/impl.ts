import { createHmac } from "node:crypto";

export type Logger = { error: (message: string, meta?: Record<string, unknown>) => void };

export type Event = { id: string; type: string };

export function handleWebhook(secret: string, body: string, signature: string, logger: Logger): Event | null {
  try {
    const expected = createHmac("sha256", secret).update(body).digest("hex");
    if (expected !== signature) {
      logger.error("signature mismatch", { signature });
      return null;
    }
    return JSON.parse(body) as Event;
  } catch (err) {
    logger.error("webhook handling failed", { err });
    return null;
  }
}
