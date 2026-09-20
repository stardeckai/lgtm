import { describe, expect, it } from "vitest";
import { rotate, TokenStore } from "./impl";

describe("rotate", () => {
  it("kills the whole family when an already rotated token is presented again", () => {
    const store = new TokenStore();
    store.save({ token: "t1", userId: "u1", familyId: "f1", revoked: false });
    let minted = 1;
    const mint = () => `t${++minted}`;

    expect(rotate(store, "t1", mint)).toEqual({ token: "t2" });
    expect(rotate(store, "t1", mint)).toEqual({ error: "token reuse detected" });
    expect(store.get("t2")?.revoked).toBe(true);
    expect(rotate(store, "t2", mint)).toEqual({ error: "token reuse detected" });
  });
});
