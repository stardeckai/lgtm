import { dbWs } from "./client";
import { auditTable, seatTable } from "./schema";

export type SeatMove = { orgId: string; fromUserId: string; toUserId: string; actorId: string };

export async function transferSeat(move: SeatMove): Promise<{ transferred: boolean }> {
  return dbWs.transaction(async (tx) => {
    const seats = await tx.select(seatTable).where({ orgId: move.orgId, userId: move.fromUserId });
    if (seats.length === 0) return { transferred: false };
    await tx.update(seatTable, { userId: move.toUserId }).where({ id: seats[0]!.id });
    await tx.insert(auditTable, {
      orgId: move.orgId,
      action: "seat.transferred",
      actorId: move.actorId,
      detail: `${move.fromUserId}->${move.toUserId}`,
    });
    return { transferred: true };
  });
}
