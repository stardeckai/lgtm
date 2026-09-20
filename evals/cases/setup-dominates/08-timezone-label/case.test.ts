import { describe, expect, it } from "vitest";
import { offsetLabel } from "./impl";

const WORKING_HOURS = {
  monday: { start: "09:00", end: "17:30" },
  tuesday: { start: "09:00", end: "17:30" },
  wednesday: { start: "09:00", end: "17:30" },
  thursday: { start: "09:00", end: "17:30" },
  friday: { start: "09:00", end: "16:00" },
  saturday: null,
  sunday: null,
};

const HOLIDAYS = [
  { date: "2024-12-25", name: "Christmas Day" },
  { date: "2024-12-26", name: "Boxing Day" },
  { date: "2025-01-01", name: "New Year" },
  { date: "2025-04-18", name: "Good Friday" },
];

const RESOURCES = Array.from({ length: 9 }, (_, i) => ({
  id: `res_${i}`,
  name: `Room ${i + 1}`,
  capacity: 4 + i,
  equipment: i % 2 === 0 ? ["display", "camera"] : ["display"],
  bookableFrom: "2024-01-01",
}));

describe("offsetLabel", () => {
  it("renders a negative half-hour offset with padded digits", () => {
    const calendar = { workingHours: WORKING_HOURS, holidays: HOLIDAYS, resources: RESOURCES, bufferMinutes: 10 };
    const bookings = RESOURCES.flatMap((resource) =>
      HOLIDAYS.map((holiday) => ({ resourceId: resource.id, date: holiday.date, slots: [] as string[] })),
    );

    expect(offsetLabel(-210)).toBe("UTC-03:30");
  });
});
