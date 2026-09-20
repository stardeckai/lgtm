import { describe, expect, it } from "vitest";
import { nextStatus, type Ticket } from "./impl";

describe("nextStatus", () => {
  it("reopens a resolved ticket when the customer writes back", () => {
    const resolved: Ticket = { id: "t1", status: "resolved", lastReplyBy: "agent" };

    expect(nextStatus(resolved, "customer")).toBe("open");
    expect(nextStatus(resolved, "agent")).toBe("resolved");
    expect(nextStatus({ ...resolved, status: "open" }, "agent")).toBe("waiting");
  });
});
