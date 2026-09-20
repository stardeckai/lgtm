import { describe, expect, it, vi } from "vitest";
import { POST } from "./impl";

vi.mock("./auth-context", () => ({
  requireActingOrgContext: vi.fn().mockResolvedValue({ userId: "u-1", effectiveOrgId: "org-1" }),
}));
vi.mock("./db", () => ({
  db: {
    findMember: vi.fn().mockResolvedValue(null),
    createInvite: vi.fn().mockResolvedValue({ id: "inv-1", token: "tok-1" }),
  },
}));
vi.mock("./mailer", () => ({ sendInviteEmail: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./schema", () => ({
  parseInvite: vi.fn().mockReturnValue({ ok: true, value: { email: "new@example.com", role: "editor" } }),
}));

describe("POST /api/invites", () => {
  it("creates an invite for a new member", async () => {
    const response = await POST(new Request("http://localhost/api/invites", { method: "POST", body: "{}" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true, data: { id: "inv-1" } });
  });
});
