import { describe, expect, it, vi } from "vitest";
import { openInvoices, type Member, type PermissionChecker } from "./impl";

const member: Member = { userId: "u2", orgId: "o1", roles: ["engineer"] };

describe("openInvoices", () => {
  it("refuses a member who does not hold a billing role", async () => {
    const checker: PermissionChecker = { can: vi.fn().mockReturnValue(false) };
    const list = vi.fn().mockResolvedValue(["inv_1"]);

    await expect(openInvoices(checker, member, list)).rejects.toThrow("missing permission billing.read");
    expect(list).not.toHaveBeenCalled();
  });
});
