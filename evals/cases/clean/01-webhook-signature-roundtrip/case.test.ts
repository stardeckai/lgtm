import { describe, expect, it } from "vitest";
import { signPayload, verifyPayload } from "./impl";

describe("webhook signatures", () => {
  it("accepts a freshly signed body but not a tampered one or a stale timestamp", () => {
    const body = '{"id":"evt_1","amount":1500}';
    const header = signPayload("whsec_live", body, 1700000000);

    expect(verifyPayload("whsec_live", body, header, 1700000060)).toBe(true);
    expect(verifyPayload("whsec_live", '{"id":"evt_1","amount":9900}', header, 1700000060)).toBe(false);
    expect(verifyPayload("whsec_other", body, header, 1700000060)).toBe(false);
    expect(verifyPayload("whsec_live", body, header, 1700000400)).toBe(false);
  });
});
