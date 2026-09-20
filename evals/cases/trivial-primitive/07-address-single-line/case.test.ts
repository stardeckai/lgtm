import { describe, expect, it } from "vitest";
import { singleLineAddress } from "./impl";

describe("singleLineAddress", () => {
  it("joins the address parts with commas", () => {
    expect(
      singleLineAddress({ line1: "12 Bridge Rd", line2: "", city: "Leeds", postcode: "LS1 4AP" }),
    ).toBe("12 Bridge Rd, Leeds, LS1 4AP");
  });
});
