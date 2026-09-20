import { describe, expect, it } from "vitest";
import { readSettings } from "./impl";

describe("readSettings", () => {
  it("falls back to the defaults for a settings column an older writer truncated", () => {
    expect(readSettings('{"digest":"dai')).toEqual({ digest: "weekly", channels: ["email"] });
    expect(readSettings('{"digest":"hourly","channels":[]}')).toEqual({
      digest: "weekly",
      channels: ["email"],
    });
  });
});
