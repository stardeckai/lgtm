import { describe, expect, it } from "vitest";
import { severityColour } from "./impl";

describe("severityColour", () => {
  it("maps each severity to its badge colour", () => {
    expect(severityColour("sev1")).toBe("red");
    expect(severityColour("sev2")).toBe("orange");
    expect(severityColour("sev3")).toBe("amber");
    expect(severityColour("sev4")).toBe("blue");
    expect(severityColour("sev5")).toBe("grey");
  });
});
