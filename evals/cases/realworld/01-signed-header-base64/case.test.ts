import { describe, expect, it } from "vitest";
import { signOutboundRequest } from "./impl";

describe("signOutboundRequest", () => {
  it("encodes the claims as valid base64", () => {
    const header = signOutboundRequest("shared-secret", {
      workspaceId: "ws_123",
      appId: "app_456",
      releaseId: "rel_789",
    });
    const [encoded] = header.split(".");

    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);

    expect(parsed).toBeDefined();
  });
});
