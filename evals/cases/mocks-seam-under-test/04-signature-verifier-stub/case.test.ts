import { describe, expect, it, vi } from "vitest";
import { handleWebhook, type SignatureVerifier } from "./impl";

describe("handleWebhook", () => {
  it("rejects a payload whose signature does not match the body", () => {
    const verifier: SignatureVerifier = { verify: vi.fn().mockReturnValue(false) };
    const apply = vi.fn();

    const reply = handleWebhook(verifier, '{"id":"evt_2"}', "sha256=deadbeef", apply);

    expect(reply).toEqual({ status: 401, body: "bad signature" });
    expect(apply).not.toHaveBeenCalled();
  });
});
