import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createApp: vi.fn(),
  createPermission: vi.fn(),
  createRole: vi.fn(),
  listPermissions: vi.fn(),
  listRoles: vi.fn(),
  setRolePermissions: vi.fn(),
  forkRepository: vi.fn(),
  uniqueSlug: vi.fn(),
}));

vi.mock("./store", () => ({
  createApp: mocks.createApp,
  createPermission: mocks.createPermission,
  createRole: mocks.createRole,
  listPermissions: mocks.listPermissions,
  listRoles: mocks.listRoles,
  setRolePermissions: mocks.setRolePermissions,
}));
vi.mock("./repository", () => ({ forkRepository: mocks.forkRepository }));
vi.mock("./slug", () => ({ uniqueSlug: mocks.uniqueSlug }));

import { duplicateApp } from "./impl";

const OWNER_ID = "user_1";
const WORKSPACE_ID = "ws_1";
const SOURCE_APP_ID = "app_source";
const NEW_APP_ID = "app_new";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.uniqueSlug.mockResolvedValue("copy-of-source");
  mocks.forkRepository.mockResolvedValue({ owner: "org", name: "copy-of-source" });
  mocks.createApp.mockResolvedValue({ id: NEW_APP_ID, slug: "copy-of-source" });
  mocks.listPermissions.mockResolvedValue([]);
  mocks.listRoles.mockResolvedValue([]);
  mocks.createPermission.mockResolvedValue({ id: "perm_new" });
  mocks.createRole.mockResolvedValue({ id: "role_new" });
  mocks.setRolePermissions.mockResolvedValue(undefined);
});

describe("duplicateApp", () => {
  it("skips soft-deleted permissions", async () => {
    mocks.listPermissions.mockResolvedValue([
      { id: "perm_1", name: "Deleted", key: "del", deletedAt: new Date("2024-03-01T00:00:00Z") },
    ]);

    await duplicateApp(OWNER_ID, WORKSPACE_ID, SOURCE_APP_ID, {});

    expect(mocks.createPermission).not.toHaveBeenCalled();
  });
});
