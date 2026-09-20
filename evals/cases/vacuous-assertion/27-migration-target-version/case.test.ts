import { describe, expect, it } from "vitest";
import { upgrade } from "./impl";

describe("upgrade", () => {
  it("installs email-sdk 2.1.0 when a project stops at 7.4.0", () => {
    const upgraded = upgrade({ id: "p-1", version: "7.3.0", deps: {} }, "7.4.0");

    expect(upgraded.version).toBe("7.4.0");
    expect(upgraded.deps).toEqual({ "email-sdk": "2.1.0" });
  });
});
