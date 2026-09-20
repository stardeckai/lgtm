import { describe, expect, it } from "vitest";
import { Waitlist } from "./impl";

describe("Waitlist.join", () => {
  it("treats gmail dots, plus tags and googlemail as the same address but keeps other domains distinct", () => {
    const list = new Waitlist();

    expect(list.join("Ada.Lovelace+news@gmail.com")).toBe(true);
    expect(list.join("adalovelace@googlemail.com")).toBe(false);
    expect(list.join("ada.lovelace@fastmail.com")).toBe(true);
    expect(list.join("adalovelace@fastmail.com")).toBe(true);
  });
});
