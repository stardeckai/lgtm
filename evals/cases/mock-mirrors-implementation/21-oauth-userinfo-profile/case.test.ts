import { describe, expect, it, vi } from "vitest";
import { toProfile, type IdentityProvider } from "./impl";

describe("toProfile", () => {
  it("normalises the email and treats a string email_verified claim as unverified", async () => {
    const provider: IdentityProvider = {
      userInfo: vi.fn().mockResolvedValue({
        sub: 90210,
        email: "  Ada.Lovelace@Example.COM ",
        email_verified: "true",
        given_name: "Ada",
        picture: null,
      }),
    };

    await expect(toProfile(provider, "at_abc")).resolves.toEqual({
      externalId: "90210",
      email: "ada.lovelace@example.com",
      emailVerified: false,
      displayName: "Ada",
      avatarUrl: null,
    });
  });
});
