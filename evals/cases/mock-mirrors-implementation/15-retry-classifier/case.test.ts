import { describe, expect, it, vi } from "vitest";
import { nextDelayMs, type Attempt, type Classifier } from "./impl";

const classifier: Classifier = {
  classify: vi.fn((attempt: Attempt) => {
    if (attempt.status === 429) return attempt.attempt < 5 ? "retry" : "drop";
    if (attempt.status >= 500) return attempt.attempt < 3 ? "retry" : "fail";
    if (attempt.status === 408 || attempt.errorCode === "ETIMEDOUT") return "retry";
    return attempt.status >= 400 ? "fail" : "drop";
  }),
};

describe("nextDelayMs", () => {
  it("stops backing off once a server error has been retried three times", () => {
    expect(nextDelayMs(classifier, { status: 503, attempt: 2 })).toBe(2000);
    expect(nextDelayMs(classifier, { status: 503, attempt: 3 })).toBe(null);
    expect(nextDelayMs(classifier, { status: 429, attempt: 3 })).toBe(4000);
  });
});
