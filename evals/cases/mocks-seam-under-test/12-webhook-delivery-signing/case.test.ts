import { describe, expect, it, vi } from "vitest";
import { deliver, type Endpoint, type HttpClient, type Signer } from "./impl";

const endpoint: Endpoint = { url: "https://hooks.example/acme", secret: "whsec_1" };
const http: HttpClient = { post: vi.fn().mockResolvedValue({ status: 200 }) };

describe("deliver", () => {
  it("signs the outgoing body with the endpoint secret and the current timestamp", async () => {
    const signer: Signer = { sign: vi.fn().mockReturnValue("t=1700000000,v1=abc123") };

    const result = await deliver(signer, http, endpoint, { id: "evt_9" }, 1700000000);

    expect(result.signature).toBe("t=1700000000,v1=abc123");
    expect(http.post).toHaveBeenCalledWith(
      "https://hooks.example/acme",
      '{"id":"evt_9"}',
      { "x-signature": "t=1700000000,v1=abc123" },
    );
  });
});
