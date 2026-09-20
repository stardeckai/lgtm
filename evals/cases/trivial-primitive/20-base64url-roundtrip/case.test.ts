import { describe, expect, it } from "vitest";
import { base64UrlDecode, base64UrlEncode } from "./impl";

describe("base64url", () => {
  it("encodes without padding or url-unsafe characters and decodes back to the same bytes", () => {
    const bytes = new Uint8Array([251, 255, 190, 0, 1]);

    expect(base64UrlEncode(bytes)).toBe("-_--AAE");
    expect(Array.from(base64UrlDecode("-_--AAE"))).toEqual([251, 255, 190, 0, 1]);
    expect(Array.from(base64UrlDecode(base64UrlEncode(new Uint8Array([1]))))).toEqual([1]);
  });
});
