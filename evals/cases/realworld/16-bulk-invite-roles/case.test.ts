import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireWorkspaceAdmin: vi.fn(),
  checkSeatQuota: vi.fn(),
  listWorkspaceRoles: vi.fn(),
  createInvitation: vi.fn(),
}));

vi.mock("./auth-context", () => ({ requireWorkspaceAdmin: mocks.requireWorkspaceAdmin }));
vi.mock("./billing", () => ({ checkSeatQuota: mocks.checkSeatQuota }));
vi.mock("./store", () => ({ listWorkspaceRoles: mocks.listWorkspaceRoles }));
vi.mock("./directory", () => ({ directory: { createInvitation: mocks.createInvitation } }));

import { POST } from "./impl";

const WORKSPACE_ID = "ws_1";
const ROLE_ID = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireWorkspaceAdmin.mockResolvedValue({ userId: "user_admin" });
  mocks.checkSeatQuota.mockResolvedValue({ allowed: true });
  mocks.listWorkspaceRoles.mockResolvedValue([{ id: ROLE_ID }]);
  mocks.createInvitation.mockResolvedValue({ id: "inv_1" });
});

describe("bulk invitations route", () => {
  it("stores each selected role on its directory invitation", async () => {
    const response = await POST(
      new Request("https://app.example.com/api/invitations/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitations: [{ emailAddress: "invitee@example.com", roleId: ROLE_ID }] }),
      }),
      WORKSPACE_ID
    );

    expect(response.status).toBe(200);
    expect(mocks.createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({ metadata: { workspaceRoleId: ROLE_ID } })
    );
  });
});
