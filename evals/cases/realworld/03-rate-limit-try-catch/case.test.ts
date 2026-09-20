import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationClient, RateLimitError } from "./impl";

const mockFetch = vi.fn();
const config = { endpoint: "https://notify.example.com/send", apiKey: "k" };

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch as unknown as typeof fetch;
});

describe("NotificationClient errors", () => {
  it("returns RateLimitError for 429 with retryAfter", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve('{"error":"Rate limited"}'),
      headers: new Headers({ "Retry-After": "30" }),
    });

    const client = new NotificationClient(config);

    try {
      await client.send({ to: "user@example.com", subject: "Test", body: "Hello" });
    } catch (error) {
      expect(error).toBeInstanceOf(RateLimitError);
      expect((error as RateLimitError).retryAfter).toBe(30);
    }
  });
});
