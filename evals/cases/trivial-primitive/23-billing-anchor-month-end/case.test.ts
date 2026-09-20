import { describe, expect, it } from "vitest";
import { addMonthsClamped } from "./impl";

describe("addMonthsClamped", () => {
  it("clamps a month-end anchor to the last day of a shorter month", () => {
    expect(addMonthsClamped("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonthsClamped("2023-01-31", 1)).toBe("2023-02-28");
    expect(addMonthsClamped("2024-01-31", 3)).toBe("2024-04-30");
    expect(addMonthsClamped("2024-12-15", 1)).toBe("2025-01-15");
  });
});
