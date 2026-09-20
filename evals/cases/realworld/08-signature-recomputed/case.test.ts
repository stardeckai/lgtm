import crypto from "crypto";
import { describe, expect, it } from "vitest";
import { signCall } from "./impl";

describe("signCall", () => {
  it("signs the canonical method, path, timestamp and body", () => {
    const call = {
      method: "post",
      path: "/v1/orders",
      body: '{"orderId":"ord_1"}',
      timestamp: 1705320000,
    };

    const expectedCanonical = [
      call.method.toUpperCase(),
      call.path,
      String(call.timestamp),
      call.body,
    ].join("\n");
    const expected = crypto
      .createHmac("sha256", "shared-secret")
      .update(expectedCanonical)
      .digest("hex");

    expect(signCall("shared-secret", call)).toBe(expected);
  });
});
