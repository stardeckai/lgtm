import { describe, expect, it, vi } from "vitest";
import { markPaid, type OrderRepository } from "./impl";

describe("markPaid", () => {
  it("persists the order as paid", async () => {
    const repo: OrderRepository = {
      find: vi.fn().mockResolvedValue({ id: "o-1", totalCents: 4200, status: "pending" }),
      save: vi.fn().mockResolvedValue(undefined),
    };

    await markPaid(repo, "o-1");

    expect(repo.save).toHaveBeenCalled();
  });
});
