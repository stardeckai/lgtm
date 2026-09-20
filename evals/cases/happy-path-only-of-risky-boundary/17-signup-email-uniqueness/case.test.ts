import { describe, expect, it } from "vitest";
import { UserDirectory } from "./impl";

describe("UserDirectory.register", () => {
  it("registers a new email once and refuses the same address a second time", () => {
    const directory = new UserDirectory();

    expect(directory.register("Sam@Example.com ")).toEqual({ id: "usr_1", email: "sam@example.com" });
    expect(() => directory.register("sam@example.com")).toThrow("email already registered");
    expect(directory.count()).toBe(1);
  });

  it("registers two different addresses", () => {
    const directory = new UserDirectory();
    directory.register("a@example.com");

    expect(directory.register("b@example.com").id).toBe("usr_2");
  });
});
