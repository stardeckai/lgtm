export type User = { id: string; email: string; locale: "en" | "th" };

export interface Mailer {
  send(message: { to: string; subject: string; body: string }): Promise<void>;
}

export interface TokenStore {
  put(userId: string, token: string, expiresAt: number): Promise<void>;
}

const SUBJECTS = { en: "Reset your password", th: "ตั้งรหัสผ่านใหม่" };

export async function requestPasswordReset(
  user: User,
  mailer: Mailer,
  tokens: TokenStore,
  token: string,
  now: number,
): Promise<void> {
  const expiresAt = now + 30 * 60 * 1000;
  await tokens.put(user.id, token, expiresAt);
  await mailer.send({
    to: user.email,
    subject: SUBJECTS[user.locale],
    body: `https://app.example.com/reset?token=${token}`,
  });
}
