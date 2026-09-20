export interface IdentityProvider {
  userInfo(accessToken: string): Promise<Record<string, unknown>>;
}

export type Profile = {
  externalId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  avatarUrl: string | null;
};

export async function toProfile(provider: IdentityProvider, token: string): Promise<Profile> {
  const claims = await provider.userInfo(token);
  const email = typeof claims.email === "string" ? claims.email.trim().toLowerCase() : "";
  if (!email) throw new Error("identity provider returned no email");
  const given = typeof claims.given_name === "string" ? claims.given_name : "";
  const family = typeof claims.family_name === "string" ? claims.family_name : "";
  return {
    externalId: String(claims.sub),
    email,
    emailVerified: claims.email_verified === true,
    displayName: [given, family].filter(Boolean).join(" ") || email,
    avatarUrl: typeof claims.picture === "string" ? claims.picture : null,
  };
}
