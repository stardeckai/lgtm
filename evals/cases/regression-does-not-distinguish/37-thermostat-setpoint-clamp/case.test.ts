import { describe, expect, it } from "vitest";
import { setSetpoint, type Zone } from "./impl";

const zone: Zone = { name: "ward-3", setpointC: 21, occupied: true };

describe("setSetpoint", () => {
  it("holds a requested temperature inside the safe band for the room", () => {
    expect(setSetpoint(zone, 42).setpointC).toBe(30);
    expect(setSetpoint(zone, -4).setpointC).toBe(5);
    expect(setSetpoint(zone, 23).setpointC).toBe(23);
  });
});
