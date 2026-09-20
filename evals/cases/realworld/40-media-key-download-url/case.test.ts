import { describe, expect, it, vi } from "vitest";
import { getMediaDownloadUrl, MediaValidationError, validateMediaKey } from "./impl";

describe("media key validation and URL resolution", () => {
  it("resolves a namespaced key and refuses a traversal key before reaching storage", async () => {
    const getDownloadUrl = vi.fn(async (storageKey: string) => ({
      downloadUrl: `https://cdn.example.net/${storageKey}`,
    }));
    const store = { getDownloadUrl };

    await expect(getMediaDownloadUrl(store, "sessions/../secret.webp")).rejects.toThrow(
      MediaValidationError,
    );
    expect(getDownloadUrl).not.toHaveBeenCalled();

    expect(validateMediaKey("sessions/example.webp")).toBe("sessions/example.webp");
    await expect(getMediaDownloadUrl(store, "sessions/example.webp")).resolves.toBe(
      "https://cdn.example.net/sessions/example.webp",
    );
    expect(getDownloadUrl).toHaveBeenCalledWith("sessions/example.webp");
  });
});
