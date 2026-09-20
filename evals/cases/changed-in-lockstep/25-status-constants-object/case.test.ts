import { describe, expect, it } from "vitest";
import { nextStatus, TicketStatus, type Ticket } from "./impl";

describe("nextStatus", () => {
  it("reopens a resolved ticket when the customer writes back", () => {
    const resolved: Ticket = { id: "t1", status: TicketStatus.Resolved, lastReplyBy: "agent" };

    expect(nextStatus(resolved, "customer")).toBe("open");
    expect(nextStatus(resolved, "agent")).toBe("resolved");
    expect(nextStatus({ ...resolved, status: TicketStatus.Open }, "agent")).toBe("waiting");
  });
});
