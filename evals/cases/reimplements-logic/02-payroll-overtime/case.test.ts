import { describe, expect, it } from "vitest";
import { weeklyPayCents, type Shift } from "./impl";

describe("weeklyPayCents", () => {
  it("pays time and a half beyond forty hours", () => {
    const shifts: Shift[] = [
      { day: "mon", hours: 9.5 },
      { day: "tue", hours: 9.5 },
      { day: "wed", hours: 9.5 },
      { day: "thu", hours: 9.5 },
      { day: "fri", hours: 8 },
    ];
    const rate = 2350;

    const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0);
    const regular = Math.min(totalHours, 40);
    const overtime = Math.max(0, totalHours - 40);

    expect(weeklyPayCents(shifts, rate)).toBe(
      Math.round(regular * rate + overtime * rate * 1.5),
    );
  });
});
