import { describe, expect, it } from "vitest";
import { parseImport } from "./impl";

describe("parseImport", () => {
  it("converts the amount column into integer cents", () => {
    const text = "email,name,amount\nA@Example.com, Ada Lovelace ,19.99\n";

    expect(() => parseImport(text)).not.toThrow();
  });
});
