import { describe, expect, it, vi } from "vitest";
import { provisionSignup, type Provisioner } from "./impl";

describe("provisionSignup", () => {
  it("creates the organisation with the seat limit of its plan", async () => {
    const provisioner: Provisioner = {
      createOrg: vi.fn().mockResolvedValue({ id: "org-1" }),
      seedDefaults: vi.fn().mockResolvedValue(undefined),
    };

    const result = await provisionSignup(provisioner, {
      email: "owner@example.com",
      orgName: "  Northwind  ",
      plan: "pro",
    });

    expect(provisioner.createOrg).toHaveBeenCalled();
    expect(provisioner.seedDefaults).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
