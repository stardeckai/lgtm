import { describe, expect, it, vi } from "vitest";
import { signup } from "./impl";

describe("signup", () => {
  it("creates the account and issues a session", async () => {
    const captcha = { verify: vi.fn().mockResolvedValue(true) };
    const users = { byEmail: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({ id: "u-1" }) };
    const hasher = { hash: vi.fn().mockResolvedValue("hashed") };
    const sessions = {
      issue: vi.fn().mockResolvedValue({ token: "sess_1", expiresAt: "2024-10-01T00:00:00.000Z" }),
    };

    const result = await signup(captcha, users, hasher, sessions, {
      email: "new@example.com",
      password: "hunter2hunter2",
      captchaToken: "cap",
      ip: "1.2.3.4",
    });

    expect(result.userId).toBe("u-1");
    expect(result.session.token).toBe("sess_1");
  });
});
