import { describe, expect, it } from "vitest";
import { AuditLog } from "./impl";

describe("AuditLog", () => {
  it("stores a nested secret as a placeholder and reads back everything else intact", () => {
    const log = new AuditLog();

    log.record("u1", "user.update", {
      email: "sam@example.com",
      password: "hunter2",
      billing: { cardNumber: "4111111111111111", last4: "1111" },
      roles: ["admin"],
    });

    expect(log.forActor("u1")).toEqual([
      {
        actor: "u1",
        action: "user.update",
        payload: {
          email: "sam@example.com",
          password: "[redacted]",
          billing: { cardNumber: "[redacted]", last4: "1111" },
          roles: ["admin"],
        },
      },
    ]);
    expect(log.forActor("u2")).toEqual([]);
  });
});
