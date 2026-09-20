import { describe, expect, test } from "vitest";
import { conflicts, type Booking } from "./impl";

describe("conflicts", () => {
  test("counts only same-room, same-day bookings that touch the buffered window", () => {
    const existing: Booking[] = [
      { id: "ends_before", roomId: "room_1", day: "2024-05-06", startMinute: 480, endMinute: 540 },
      { id: "ends_at_start", roomId: "room_1", day: "2024-05-06", startMinute: 540, endMinute: 600 },
      { id: "wraps_candidate", roomId: "room_1", day: "2024-05-06", startMinute: 600, endMinute: 660 },
      { id: "starts_at_end", roomId: "room_1", day: "2024-05-06", startMinute: 615, endMinute: 675 },
      { id: "starts_after", roomId: "room_1", day: "2024-05-06", startMinute: 700, endMinute: 760 },
      { id: "other_room_same_time", roomId: "room_2", day: "2024-05-06", startMinute: 600, endMinute: 660 },
      { id: "same_room_next_day", roomId: "room_1", day: "2024-05-07", startMinute: 600, endMinute: 660 },
      { id: "same_room_prev_day", roomId: "room_1", day: "2024-05-05", startMinute: 600, endMinute: 660 },
    ];
    const candidate = { roomId: "room_1", day: "2024-05-06", startMinute: 605, endMinute: 612 };

    expect(conflicts(existing, candidate, 0).map((b) => b.id)).toEqual(["wraps_candidate"]);
    expect(conflicts(existing, candidate, 10).map((b) => b.id)).toEqual([
      "ends_at_start",
      "wraps_candidate",
      "starts_at_end",
    ]);
    expect(conflicts(existing, candidate, 100).map((b) => b.id)).toEqual([
      "ends_before",
      "ends_at_start",
      "wraps_candidate",
      "starts_at_end",
      "starts_after",
    ]);
  });
});
