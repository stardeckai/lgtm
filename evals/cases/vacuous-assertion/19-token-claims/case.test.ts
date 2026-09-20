import { describe, expect, it } from "vitest";
import { issue, read } from "./impl";

describe("tokens", () => {
  it("carries the subject and scopes through a signed round trip", () => {
    const token = issue("k1", { sub: "u-9", scopes: ["read:orders"], exp: 1_700_000_060 });

    expect(token).toBeTruthy();
    expect(read("k1", token)).toEqual({ sub: "u-9", scopes: ["read:orders"], exp: 1_700_000_060 });
    expect(() => read("k2", token)).toThrow("bad signature");
  });
});
