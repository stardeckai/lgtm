import { describe, expect, it } from "vitest";
import { breachedResponseTarget, type Ticket } from "./impl";

describe("breachedResponseTarget", () => {
  it("breaches an urgent ticket answered 61 minutes after it opened", () => {
    const ticket = {
      id: "tkt_31",
      priority: "urgent",
      openedAtMs: 1_700_000_000_000,
      firstResponseAtMs: 1_700_000_000_000 + 61 * 60_000,
    } as Ticket;

    expect(breachedResponseTarget(ticket, 1_700_000_000_000 + 90 * 60_000)).toBe(true);
    expect(
      breachedResponseTarget({ ...ticket, firstResponseAtMs: ticket.openedAtMs + 59 * 60_000 }, 0),
    ).toBe(false);
  });
});
