import { describe, expect, it, vi } from "vitest";
import { AccessDenied, authorize, type Claims, type DirectoryApi } from "./impl";

const api: DirectoryApi = { membership: vi.fn().mockResolvedValue({ roles: ["analyst"] }) };

const claims: Claims = {
  sub: "u_1",
  orgId: "org_1",
  scopes: ["reports:read", "reports:export"],
  exp: 1_700_000_100,
};

describe("authorize", () => {
  it("lets an analyst read reports but not export them", async () => {
    await expect(authorize(api, claims, "reports:read", 1_700_000_000)).resolves.toEqual({
      userId: "u_1",
      roles: ["analyst"],
    });
    await expect(authorize(api, claims, "reports:export", 1_700_000_000)).rejects.toBeInstanceOf(
      AccessDenied,
    );
    await expect(authorize(api, claims, "reports:read", 1_700_000_200)).rejects.toBeInstanceOf(
      AccessDenied,
    );
  });
});
