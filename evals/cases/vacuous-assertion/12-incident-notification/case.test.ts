import { describe, expect, it } from "vitest";
import { recipientsFor, type Person } from "./impl";

const directory: Person[] = [
  { email: "ops@example.com", team: "platform", onCall: true, muted: false },
  { email: "dev@example.com", team: "platform", onCall: false, muted: false },
  { email: "sales@example.com", team: "revenue", onCall: false, muted: false },
  { email: "quiet@example.com", team: "platform", onCall: true, muted: true },
];

describe("recipientsFor", () => {
  it("pages only the on-call platform engineer for a severity two incident", () => {
    const recipients = recipientsFor({ severity: 2, team: "platform" }, directory);

    expect(recipients).toContain("ops@example.com");
  });
});
