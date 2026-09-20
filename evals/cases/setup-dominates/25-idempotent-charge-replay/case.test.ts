import { describe, expect, it } from "vitest";
import { ChargeService } from "./impl";

describe("ChargeService", () => {
  it("replays the stored charge for a repeated key and refuses a key reused with a different amount", () => {
    const service = new ChargeService();
    const first = service.charge({ idempotencyKey: "key_1", customerId: "cus_1", amountCents: 2500 });
    const replay = service.charge({ idempotencyKey: "key_1", customerId: "cus_1", amountCents: 2500 });

    expect(replay).toEqual(first);
    expect(service.count()).toBe(1);
    expect(() => service.charge({ idempotencyKey: "key_1", customerId: "cus_1", amountCents: 9900 })).toThrow(
      "idempotency_key_reused",
    );
    expect(service.count()).toBe(1);
  });
});
