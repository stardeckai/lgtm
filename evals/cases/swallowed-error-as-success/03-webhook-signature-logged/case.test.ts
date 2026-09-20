import { describe, expect, it, vi } from "vitest";
import { handleWebhook } from "./impl";

describe("handleWebhook", () => {
  it("rejects a body whose signature does not match the secret", () => {
    const logger = { error: vi.fn() };

    const result = handleWebhook("whsec_1", '{"id":"evt_1","type":"order.paid"}', "deadbeef", logger);

    expect(result).toBeNull();
    expect(logger.error).toHaveBeenCalled();
  });
});
