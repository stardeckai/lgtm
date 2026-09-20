import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./impl";

describe("password hashing", () => {
  it("accepts the password it hashed and two different salts for the same password", () => {
    const stored = hashPassword("corr3ct horse");
    const other = hashPassword("corr3ct horse");

    expect(verifyPassword("corr3ct horse", stored)).toBe(true);
    expect(verifyPassword("corr3ct hors", stored)).toBe(false);
    expect(verifyPassword("corr3ct horse", "plain$abc$def")).toBe(false);
    expect(stored).not.toBe(other);
    expect(verifyPassword("corr3ct horse", other)).toBe(true);
  });
});
