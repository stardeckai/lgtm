import { describe, expect, it } from "vitest";
import { checkUpload } from "./impl";

describe("checkUpload", () => {
  it("refuses a scriptable image type", () => {
    expect(checkUpload({ filename: "logo.png", contentType: "image/png", bytes: 2048 })).toEqual({ ok: true });
    expect(checkUpload({ filename: "page.html", contentType: "text/html", bytes: 2048 })).toEqual({
      ok: false,
      reason: "unsupported type",
    });
  });
});
