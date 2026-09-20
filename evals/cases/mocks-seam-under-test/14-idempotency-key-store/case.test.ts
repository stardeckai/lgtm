import { describe, expect, it, vi } from "vitest";
import { withIdempotency, type IdempotencyStore } from "./impl";

describe("withIdempotency", () => {
  it("runs the handler once when the same request key arrives twice", async () => {
    const stored = { status: 201, body: '{"id":"ch_1"}' };
    const store: IdempotencyStore = {
      claim: vi.fn().mockResolvedValue(true),
      read: vi.fn().mockResolvedValueOnce(null).mockResolvedValue(stored),
      write: vi.fn().mockResolvedValue(undefined),
    };
    const handler = vi.fn().mockResolvedValue(stored);

    const first = await withIdempotency(store, "idem_7", handler);
    const second = await withIdempotency(store, "idem_7", handler);

    expect(first).toEqual(stored);
    expect(second).toEqual(stored);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
