import { describe, expect, it, vi } from "vitest";
import { sendCampaign, type HttpClient } from "./impl";

describe("sendCampaign", () => {
  it("reads the retry-after header when the provider throttles the send", async () => {
    const client: HttpClient = {
      post: vi.fn().mockResolvedValue({ status: 429, headers: { "retry-after": "90" }, body: "" }),
    };

    await expect(sendCampaign(client, "list_7")).resolves.toEqual({
      kind: "throttled",
      retryAfterSeconds: 90,
    });
    expect(client.post).toHaveBeenCalledWith("https://api.mail.example/send", { listId: "list_7" });
  });
});
