import { describe, expect, it } from "vitest";
import { nextForAgent, type Ticket, type TicketRepository } from "./impl";

const rows: Ticket[] = [
  { id: "t-1", queue: "billing", priority: 2, assigneeId: null, updatedAt: "2024-07-01T09:00:00.000Z" },
  { id: "t-2", queue: "billing", priority: 1, assigneeId: "u-9", updatedAt: "2024-07-01T08:00:00.000Z" },
  { id: "t-3", queue: "billing", priority: 1, assigneeId: null, updatedAt: "2024-07-01T11:00:00.000Z" },
  { id: "t-4", queue: "support", priority: 1, assigneeId: null, updatedAt: "2024-07-01T07:00:00.000Z" },
];

const repo: TicketRepository = {
  async waiting(queue, limit) {
    return rows
      .filter((row) => row.queue === queue && row.assigneeId === null)
      .sort((a, b) => a.priority - b.priority || Date.parse(a.updatedAt) - Date.parse(b.updatedAt))
      .slice(0, limit);
  },
};

describe("nextForAgent", () => {
  it("hands out the oldest unassigned ticket of the highest priority in the queue", async () => {
    await expect(nextForAgent(repo, "billing")).resolves.toBe("t-3");
  });
});
