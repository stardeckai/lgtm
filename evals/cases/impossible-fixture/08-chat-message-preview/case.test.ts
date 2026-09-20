import { describe, expect, it } from "vitest";
import { threadPreview, type ChatMessage } from "./impl";

describe("threadPreview", () => {
  it("previews the most recent message in the thread", () => {
    const messages = [
      { id: "m_1", authorId: "u_1", body: "Morning", sentAt: 1 },
      { id: "m_2", authorId: "u_2", body: "", sentAt: 2 },
    ] as ChatMessage[];

    expect(threadPreview(messages)).toBe("");
  });
});
