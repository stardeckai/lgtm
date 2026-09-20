import { describe, expect, it } from "vitest";
import { validateSignup } from "./impl";

describe("validateSignup", () => {
  it("reports every broken rule rather than stopping at the first", () => {
    expect(validateSignup({ email: "not-an-email", password: "short", age: 12 })).toMatchInlineSnapshot(`
      [
        "email: must be a valid address",
        "password: must be at least 12 characters",
        "password: must contain a digit",
        "age: must be 16 or older",
      ]
    `);
    expect(validateSignup({ email: "ok@example.com", password: "correct-horse-1", age: 16 })).toEqual([]);
  });
});
