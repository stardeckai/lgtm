import { describe, expect, it } from "vitest";
import { groupForDigest, type Notification } from "./impl";

describe("groupForDigest", () => {
  it("collects everything a user is owed into one digest", () => {
    const items: Notification[] = [
      { userId: "u1", channel: "email", subject: "Invoice ready" },
      { userId: "u1", channel: "push", subject: "Deploy finished" },
      { userId: "u2", channel: "email", subject: "Invite" },
    ];

    const groups = groupForDigest(items);

    expect(Object.keys(groups).sort()).toEqual(["u1", "u2"]);
    expect(groups["u1"]).toHaveLength(2);
  });
});
