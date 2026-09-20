import { describe, expect, it, vi } from "vitest";
import { drain, Outbox, type Transport } from "./impl";

describe("drain", () => {
  it("leaves a failed message in the outbox with a bumped attempt count and removes the delivered one", async () => {
    const outbox = new Outbox();
    outbox.enqueue({ id: "m-1", to: "+15550001", body: "ok", attempts: 0 });
    outbox.enqueue({ id: "m-2", to: "+15550002", body: "boom", attempts: 1 });
    const transport: Transport = {
      send: vi.fn(async (to: string) => {
        if (to === "+15550002") throw new Error("carrier rejected");
      }),
    };

    const result = await drain(outbox, transport);

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(outbox.all()).toEqual([{ id: "m-2", to: "+15550002", body: "boom", attempts: 2 }]);
  });
});
