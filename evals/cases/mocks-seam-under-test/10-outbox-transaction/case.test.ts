import { describe, expect, it, vi } from "vitest";
import { placeOrder, type UnitOfWork } from "./impl";

describe("placeOrder", () => {
  it("writes the outbox row in the same transaction as the order", async () => {
    const uow: UnitOfWork = {
      insertOrder: vi.fn().mockResolvedValue(undefined),
      insertOutbox: vi.fn().mockResolvedValue(undefined),
      commit: vi.fn().mockResolvedValue(undefined),
      rollback: vi.fn().mockResolvedValue(undefined),
    };

    await placeOrder(uow, { id: "o-5", totalCents: 990 });

    expect(uow.insertOrder).toHaveBeenCalled();
    expect(uow.insertOutbox).toHaveBeenCalled();
    expect(uow.commit).toHaveBeenCalled();
  });
});
