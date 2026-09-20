import { describe, expect, it } from "vitest";
import { BookingCalendar } from "./impl";

describe("BookingCalendar", () => {
  it("reports how many minutes a room is in use across the day", () => {
    const calendar = new BookingCalendar();
    calendar.seedRaw([
      { room: "oak", startMinute: 540, endMinute: 660 },
      { room: "oak", startMinute: 600, endMinute: 720 },
    ]);

    expect(calendar.bookedMinutes("oak")).toBe(240);
  });
});
