import { describe, expect, it } from "vitest";
import { handoverNote, type Reading } from "./impl";

describe("handoverNote", () => {
  it("reports the span and the time the fridge was warmest", () => {
    const readings: Reading[] = [
      { at: "06:00", celsius: 3.1 },
      { at: "10:00", celsius: 5.4 },
      { at: "14:00", celsius: 4.2 },
    ];

    expect(handoverNote(readings)).toBe("3.1–5.4°C, peak at 10:00");
  });

  it("says so when the shift logged nothing", () => {
    expect(handoverNote([])).toBe("no readings this shift");
  });
});
