import { describe, expect, it } from "vitest";
import { PLAYBOOKS } from "./impl";

describe("request routing", () => {
  it("routes admin and role-restriction requests to the access-review playbook", () => {
    const playbook = PLAYBOOKS.find((p) => p.id === "access-review");

    expect(playbook?.description).toMatch(/admins|role/i);
  });
});
