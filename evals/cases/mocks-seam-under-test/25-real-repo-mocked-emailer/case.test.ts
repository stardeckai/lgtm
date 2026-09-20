import { describe, expect, it, vi } from "vitest";
import { inviteMember, InviteRepository, type Mailer } from "./impl";

describe("inviteMember", () => {
  it("refuses a second pending invite for the same address in the same org", async () => {
    const repo = new InviteRepository();
    const mailer: Mailer = { send: vi.fn().mockResolvedValue(undefined) };

    await inviteMember(repo, mailer, "Ada@Example.com", "org_3", "editor");

    await expect(inviteMember(repo, mailer, "ada@example.com", "org_3", "viewer")).rejects.toThrow(
      "an invite is already pending for this address",
    );
    expect(repo.pendingFor("org_3")).toEqual([
      { email: "ada@example.com", orgId: "org_3", role: "editor", acceptedAt: null },
    ]);
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });
});
