import { describe, expect, it } from "vitest";
import { Timesheet } from "./impl";

describe("Timesheet", () => {
  it("rounds the billable week to the nearest quarter hour", () => {
    const sheet = new Timesheet();
    sheet.load([
      { id: "t1", day: "2024-04-01", minutes: 200, billable: true },
      { id: "t2", day: "2024-04-02", minutes: -20, billable: true },
      { id: "t3", day: "2024-04-02", minutes: 45, billable: false },
    ]);

    expect(sheet.billableHours()).toBe(3);
  });
});
