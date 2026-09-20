import { describe, expect, it } from "vitest";
import { resolveShare, type Board, type ShareLink } from "./impl";

const boards: Board[] = [
  { id: "brd_1", orgId: "org_a", name: "Q3 roadmap" },
  { id: "brd_2", orgId: "org_b", name: "Hiring" },
];

const links: ShareLink[] = [
  { token: "tok_live", boardId: "brd_1", ownerOrgId: "org_a", expiresAtMs: 10_000 },
  { token: "tok_old", boardId: "brd_1", ownerOrgId: "org_a", expiresAtMs: 1_000 },
];

describe("resolveShare", () => {
  it("returns the board the live token points at", () => {
    expect(resolveShare(links, boards, "tok_live", "org_a", 5_000)).toEqual({
      id: "brd_1",
      orgId: "org_a",
      name: "Q3 roadmap",
    });
  });

  it("throws for a token that has passed its expiry", () => {
    expect(() => resolveShare(links, boards, "tok_old", "org_a", 5_000)).toThrow("share link expired");
  });

  it("throws for a token nobody issued", () => {
    expect(() => resolveShare(links, boards, "tok_made_up", "org_a", 5_000)).toThrow("share link not found");
  });
});
