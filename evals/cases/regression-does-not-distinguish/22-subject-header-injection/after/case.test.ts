import { describe, expect, it } from "vitest";
import { renderHeaders } from "./impl";

describe("renderHeaders", () => {
  it("does not let a crafted subject add a header of its own", () => {
    const headers = renderHeaders({
      to: "ops@example.com",
      subject: "Invoice\r\nBcc: attacker@example.com",
      body: "hello",
    });

    expect(headers.split("\r\n")).toEqual([
      "To: ops@example.com",
      "Subject: Invoice Bcc: attacker@example.com",
      "MIME-Version: 1.0",
    ]);
  });
});
