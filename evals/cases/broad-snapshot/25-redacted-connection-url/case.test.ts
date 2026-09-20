import { describe, expect, it } from "vitest";
import { redactUrl } from "./impl";

describe("redactUrl", () => {
  it("masks the password and the token query parameter but keeps the username and host", () => {
    expect(redactUrl("postgres://app_user:s3cret@db.internal:5432/main?token=abc&sslmode=require")).toMatchInlineSnapshot(
      `"postgres://app_user:***@db.internal:5432/main?token=***&sslmode=require"`,
    );
  });
});
