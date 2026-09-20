import { describe, expect, it } from "vitest";
import { SignupList } from "./impl";

describe("SignupList.register", () => {
  it("normalises gmail dots and plus tags before deciding a signup is a duplicate", () => {
    const list = new SignupList();

    expect(list.register("ada@gmail.com")).toBe(true);
    expect(list.register("ada@gmail.com")).toBe(false);
  });
});
