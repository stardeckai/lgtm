export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter: number | null
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class QuotaExceededError extends Error {}

export type NotificationInput = { to: string; subject: string; body: string };

export class NotificationClient {
  constructor(private readonly config: { endpoint: string; apiKey: string }) {}

  async send(input: NotificationInput): Promise<{ id: string }> {
    const response = await fetch(this.config.endpoint, {
      method: "POST",
      headers: { authorization: `Bearer ${this.config.apiKey}` },
      body: JSON.stringify(input),
    });
    if (response.status === 429) {
      const header = response.headers.get("Retry-After");
      throw new RateLimitError("rate limited", header ? Number(header) : null);
    }
    if (response.status === 402) throw new QuotaExceededError("quota exceeded");
    if (!response.ok) throw new Error(await response.text());
    return (await response.json()) as { id: string };
  }
}
