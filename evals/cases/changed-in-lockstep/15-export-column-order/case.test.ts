import { describe, expect, it } from "vitest";
import { exportHeader, exportRow } from "./impl";

describe("contact export", () => {
  it("writes each row under the header it declares", () => {
    const header = exportHeader();
    const row = exportRow({ id: "c1", email: "a@example.com", fullName: "Ada L", createdAt: "2026-01-02" });

    expect(header).toBe("id,full_name,email,created_at");
    expect(row).toBe("c1,Ada L,a@example.com,2026-01-02");
  });
});
