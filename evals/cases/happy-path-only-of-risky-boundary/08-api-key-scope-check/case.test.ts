import { describe, expect, it } from "vitest";
import { runOrderCommand, type ApiKey } from "./impl";

const key: ApiKey = { id: "ak_1", scopes: ["orders:read", "orders:write"], revokedAt: null };

describe("runOrderCommand", () => {
  it("runs the create command for a key that carries the write scope", () => {
    expect(runOrderCommand(key, { type: "create", orderId: "ord_1" }, 1_000)).toBe("create:ord_1");
  });

  it("runs the cancel command for the same key", () => {
    expect(runOrderCommand(key, { type: "cancel", orderId: "ord_2" }, 1_000)).toBe("cancel:ord_2");
  });

  it("accepts a key with extra unrelated scopes", () => {
    const wide: ApiKey = { ...key, scopes: [...key.scopes, "webhooks:write"] };

    expect(runOrderCommand(wide, { type: "create", orderId: "ord_3" }, 1_000)).toBe("create:ord_3");
  });
});
