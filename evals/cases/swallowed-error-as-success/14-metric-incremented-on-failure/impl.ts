export type Metrics = { increment(name: string, tags?: Record<string, string>): void };
export type SmsProvider = { send(to: string, body: string): Promise<{ messageId: string }> };

export async function sendSms(
  provider: SmsProvider,
  metrics: Metrics,
  to: string,
  body: string,
): Promise<string | null> {
  try {
    if (!to.startsWith("+")) throw new Error("number must be in E.164 form");
    const { messageId } = await provider.send(to, body);
    metrics.increment("sms.sent");
    return messageId;
  } catch {
    metrics.increment("sms.failed");
    return null;
  }
}
