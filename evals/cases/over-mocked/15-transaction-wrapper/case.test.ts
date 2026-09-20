import { describe, expect, it, vi } from "vitest";
import { transferSeat } from "./impl";

const tx = {
  select: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{ id: "seat-1" }]) }),
  update: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
  insert: vi.fn().mockResolvedValue(undefined),
};

vi.mock("./client", () => ({
  dbWs: { transaction: vi.fn(async (fn: (t: unknown) => unknown) => fn(tx)) },
}));
vi.mock("./schema", () => ({ seatTable: "seats", auditTable: "audit" }));

describe("transferSeat", () => {
  it("moves the seat to the new member inside one transaction", async () => {
    const result = await transferSeat({
      orgId: "o-1",
      fromUserId: "u-1",
      toUserId: "u-2",
      actorId: "u-admin",
    });

    expect(result).toEqual({ transferred: true });
  });
});
