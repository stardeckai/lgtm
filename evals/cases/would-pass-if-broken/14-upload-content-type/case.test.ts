import { describe, expect, it } from "vitest";
import { detectContentType } from "./impl";

describe("detectContentType", () => {
  it("identifies a PNG upload from its leading magic bytes", () => {
    const head = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);

    expect(detectContentType("logo.png", head)).toBe("image/png");
  });
});
