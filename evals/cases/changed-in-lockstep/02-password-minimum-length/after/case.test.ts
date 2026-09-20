import { describe, expect, it } from "vitest";
import { checkPassword } from "./impl";

describe("checkPassword", () => {
  it("reports a password that is under the minimum length", () => {
    expect(checkPassword("abc1def")).toEqual(["too short"]);
    expect(checkPassword("abc1defg")).toEqual([]);
  });
});
