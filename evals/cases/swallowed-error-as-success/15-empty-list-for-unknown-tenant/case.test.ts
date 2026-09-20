import { describe, expect, it } from "vitest";
import { NotificationReader, type Notification } from "./impl";

describe("NotificationReader", () => {
  it("returns nothing for a user in another tenant", () => {
    const rows: Notification[] = [
      { id: "n_1", tenantId: "ten_a", userId: "usr_1", readAt: null },
      { id: "n_2", tenantId: "ten_a", userId: "usr_1", readAt: "2024-01-01T00:00:00.000Z" },
      { id: "n_3", tenantId: "ten_b", userId: "usr_2", readAt: null },
    ];
    const reader = new NotificationReader(rows);

    expect(reader.unreadFor("ten_c", "usr_1")).toEqual([]);
  });
});
