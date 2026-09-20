import { describe, expect, it } from "vitest";
import { exportHeader, exportRow } from "./impl";

describe("contact export", () => {
  it("writes each row under the header it declares", () => {
    const header = exportHeader();
    const row = exportRow({ id: "c1", email: "a@example.com", fullName: "Ada L", createdAt: "2026-01-02" });

    expect(header).toBe("id,email,full_name,created_at");
    expect(row).toBe("c1,a@example.com,Ada L,2026-01-02");
  });
});
