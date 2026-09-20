import { describe, expect, it } from "vitest";
import { authenticate, TokenExpired } from "./impl";

describe("authenticate", () => {
  it("throws TokenExpired naming the token once its expiry has passed", async () => {
    const load = async () => ({ id: "t-1", subject: "u-4", expiresAtMs: 1_000 });

    await expect(authenticate(load, "t-1", 1_000)).rejects.toThrow(TokenExpired);
    await expect(authenticate(load, "t-1", 1_000)).rejects.toThrow("token t-1 expired");
    await expect(authenticate(load, "t-1", 999)).resolves.toBe("u-4");
  });
});
