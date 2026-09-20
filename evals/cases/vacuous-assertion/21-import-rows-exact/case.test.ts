import { describe, expect, it } from "vitest";
import { parseImport } from "./impl";

describe("parseImport", () => {
  it("lowercases the email, trims the name and stores the amount as cents", () => {
    expect(() =>
      parseImport("email,name,amount\nA@Example.com, Ada Lovelace ,19.99\n"),
    ).not.toThrow();
    expect(parseImport("email,name,amount\nA@Example.com, Ada Lovelace ,19.99\n")).toEqual([
      { email: "a@example.com", fullName: "Ada Lovelace", amountCents: 1999 },
    ]);
    expect(() => parseImport("email,name,amount\nnope, Bob ,1.00\n")).toThrow("row 1: bad email");
  });
});
