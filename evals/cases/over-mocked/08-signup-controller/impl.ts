export interface Captcha {
  verify(token: string, ip: string): Promise<boolean>;
}
export interface Users {
  byEmail(email: string): Promise<{ id: string } | null>;
  create(email: string, passwordHash: string): Promise<{ id: string }>;
}
export interface Hasher {
  hash(password: string): Promise<string>;
}
export interface Sessions {
  issue(userId: string): Promise<{ token: string; expiresAt: string }>;
}

export async function signup(
  captcha: Captcha,
  users: Users,
  hasher: Hasher,
  sessions: Sessions,
  input: { email: string; password: string; captchaToken: string; ip: string },
): Promise<{ userId: string; session: { token: string; expiresAt: string } }> {
  if (!(await captcha.verify(input.captchaToken, input.ip))) throw new Error("captcha failed");
  if (await users.byEmail(input.email)) throw new Error("email taken");
  const user = await users.create(input.email, await hasher.hash(input.password));
  return { userId: user.id, session: await sessions.issue(user.id) };
}
