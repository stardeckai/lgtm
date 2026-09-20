import { describe, expect, it } from "vitest";
import { schedule } from "./impl";

describe("schedule", () => {
  it("spreads retries out without ever scheduling one early", () => {
    expect(schedule(3, 7)).toEqual([1245, 2530, 5140]);
  });
});
