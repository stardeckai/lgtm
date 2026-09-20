import { describe, expect, it, vi } from "vitest";
import { drain, Outbox, type Sender } from "./impl";

describe("drain", () => {
  it("does not resend a row that was already published", async () => {
    const outbox = new Outbox();
    outbox.enqueue("order.placed", { id: "o-1" });
    outbox.enqueue("order.placed", { id: "o-2" });
    const sender: Sender = { send: vi.fn().mockResolvedValue(undefined) };

    expect(await drain(outbox, sender, "2024-09-01T00:00:00.000Z")).toBe(2);
    expect(await drain(outbox, sender, "2024-09-01T00:01:00.000Z")).toBe(0);
    expect(outbox.pending()).toEqual([]);
    expect(sender.send).toHaveBeenCalledTimes(2);
  });
});
