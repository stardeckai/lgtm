import { describe, expect, it } from "vitest";
import { Scheduler } from "./impl";

describe("Scheduler.run", () => {
  it("sends the reminder 24 hours before the appointment and marks it as sent", () => {
    const appointments = [{ id: "a-1", startsAtMs: 100_000_000, reminderSentAtMs: null }];
    const scheduler = new Scheduler(appointments);

    scheduler.run(100_000_000 - 60_000);

    expect(scheduler.outbox).toHaveLength(1);
  });
});
