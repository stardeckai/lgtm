import { describe, expect, it } from "vitest";
import { encodeBase64 } from "./impl";

describe("encodeBase64", () => {
  it("matches the platform encoder including the padding of a trailing partial group", () => {
    const bytes = new Uint8Array([0x4d, 0x61, 0x6e, 0x75, 0x61]);

    expect(encodeBase64(bytes)).toBe(Buffer.from(bytes).toString("base64"));
    expect(encodeBase64(new Uint8Array([0x4d]))).toBe("TQ==");
    expect(encodeBase64(new Uint8Array([]))).toBe("");
  });
});
