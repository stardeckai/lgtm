import { describe, expect, it } from "vitest";
import { extractMentions } from "./impl";

describe("extractMentions", () => {
  it("picks up a mention that opens the message", () => {
    expect(extractMentions("ping @ana and @bo_2 please")).toEqual(["ana", "bo_2"]);
    expect(extractMentions("mail ops@example.com instead")).toEqual([]);
    expect(extractMentions("hi @ana, again @ana")).toEqual(["ana"]);
  });
});
