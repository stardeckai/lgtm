import { describe, expect, test, vi } from "vitest";
import { sendSms } from "./impl";

describe("sendSms", () => {
  test("counts a failure when the destination number is not in E.164 form", async () => {
    const provider = { send: vi.fn().mockResolvedValue({ messageId: "sm_1" }) };
    const metrics = { increment: vi.fn() };

    const result = await sendSms(provider, metrics, "07700900123", "your code is 1234");

    expect(result).toBeNull();
    expect(metrics.increment).toHaveBeenCalledWith("sms.failed");
  });
});
