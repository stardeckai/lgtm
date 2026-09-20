import { describe, expect, it } from "vitest";
import { retrySchedule } from "./impl";

describe("retrySchedule", () => {
  it("stops doubling once the ceiling is reached", () => {
    expect(retrySchedule(5)).toEqual([1000, 2000, 4000, 8000, 16000]);
  });
});
