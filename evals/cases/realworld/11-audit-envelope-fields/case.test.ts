import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildAuditEnvelope } from "./impl";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-15T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("buildAuditEnvelope", () => {
  it("carries every required field at the current second", () => {
    const envelope = buildAuditEnvelope({
      workspaceId: "ws_123",
      actorId: "user_456",
      action: "role.granted",
      subjectId: "member_789",
    });

    expect(envelope.version).toBe(2);
    expect(envelope.workspaceId).toBe("ws_123");
    expect(envelope.actorId).toBe("user_456");
    expect(envelope.action).toBe("role.granted");
    expect(envelope.subjectId).toBe("member_789");
    expect(envelope.recordedAt).toBe(Math.floor(Date.parse("2024-01-15T12:00:00Z") / 1000));
    expect(envelope.eventId).toBeDefined();
  });
});
