import { describe, expect, it } from "vitest";
import { CaptureLog } from "./impl";

describe("CaptureLog", () => {
  it("captures the charge and records the amount", () => {
    const log = new CaptureLog();

    const capture = log.capture("key_1", "ch_1", 4_500);

    expect(capture).toEqual({ key: "key_1", chargeId: "ch_1", cents: 4_500 });
    expect(log.total()).toBe(4_500);
  });

  it("adds up captures made under different keys", () => {
    const log = new CaptureLog();

    log.capture("key_1", "ch_1", 1_000);
    log.capture("key_2", "ch_2", 2_500);

    expect(log.total()).toBe(3_500);
  });

  it("returns the capture it created", () => {
    const log = new CaptureLog();

    expect(log.capture("key_9", "ch_9", 100).chargeId).toBe("ch_9");
  });
});
