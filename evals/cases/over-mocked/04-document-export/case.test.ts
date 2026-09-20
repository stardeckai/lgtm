import { describe, expect, it, vi } from "vitest";
import { exportDocument } from "./impl";

describe("exportDocument", () => {
  it("uploads the rendered pdf and returns its url", async () => {
    const repo = { load: vi.fn().mockResolvedValue({ id: "d-1", title: "Plan", blocks: [] }) };
    const renderer = { toPdf: vi.fn().mockResolvedValue(new Uint8Array([1, 2])) };
    const storage = { put: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/x.pdf" }) };
    const clock = { now: vi.fn().mockReturnValue(new Date("2024-09-09T00:00:00.000Z")) };

    const result = await exportDocument(repo, renderer, storage, clock, "d-1");

    expect(result.url).toBe("https://cdn.example.com/x.pdf");
  });
});
