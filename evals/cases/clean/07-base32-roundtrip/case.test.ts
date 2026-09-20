import { describe, expect, it } from "vitest";
import { decodeBase32, encodeBase32 } from "./impl";

describe("base32", () => {
  it("pads every partial group and decodes back to the original bytes", () => {
    const secret = Uint8Array.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

    expect(encodeBase32(secret)).toBe("JBSWY3DP");
    expect(encodeBase32(Uint8Array.from([0x48]))).toBe("JA======");
    expect(Array.from(decodeBase32(encodeBase32(secret)))).toEqual([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
    expect(Array.from(decodeBase32("JA======"))).toEqual([0x48]);
  });
});
