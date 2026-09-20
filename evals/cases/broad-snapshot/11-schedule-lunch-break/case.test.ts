import { describe, expect, it } from "vitest";
import { slotsFor } from "./impl";

describe("slotsFor", () => {
  it("leaves out the slots that overlap the lunch break", () => {
    const availability = { openMinute: 540, closeMinute: 1020, breakStart: 720, breakEnd: 780 };

    expect(slotsFor(availability, 60)).toMatchInlineSnapshot(`
      [
        {
          "end": 600,
          "start": 540,
        },
        {
          "end": 660,
          "start": 600,
        },
        {
          "end": 720,
          "start": 660,
        },
        {
          "end": 840,
          "start": 780,
        },
        {
          "end": 900,
          "start": 840,
        },
        {
          "end": 960,
          "start": 900,
        },
        {
          "end": 1020,
          "start": 960,
        },
      ]
    `);
  });
});
