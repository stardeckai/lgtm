import { describe, expect, it } from "vitest";
import { decodeHeaderWord, encodeHeaderWord, subjectHeader } from "./impl";

describe("header words", () => {
  it("leaves plain ASCII alone and round-trips anything it had to encode", () => {
    expect(subjectHeader("Your receipt")).toBe("Subject: Your receipt");
    expect(encodeHeaderWord("Rückerstattung")).toBe("=?UTF-8?B?UsO8Y2tlcnN0YXR0dW5n?=");
    expect(decodeHeaderWord(encodeHeaderWord("Rückerstattung"))).toBe("Rückerstattung");
    expect(decodeHeaderWord("=?UTF-8?Q?Hello_World?=")).toBe("Hello World");
  });
});
