import { beforeEach, describe, expect, it } from "vitest";
import { cycleTheme, readTheme } from "./impl";

describe("cycleTheme", () => {
  beforeEach(() => localStorage.clear());

  it("cycles system to light to dark and back, surviving a reload each time", () => {
    expect(cycleTheme(localStorage)).toBe("light");
    expect(readTheme(localStorage)).toBe("light");

    expect(cycleTheme(localStorage)).toBe("dark");
    expect(readTheme(localStorage)).toBe("dark");

    expect(cycleTheme(localStorage)).toBe("system");
    expect(localStorage.getItem("ui.theme")).toBeNull();
  });
});
