import { describe, expect, it } from "vitest";
import { handle, type Authorizer } from "./impl";

const authorizer: Authorizer = {
  allows(role, action) {
    if (role === "admin") return true;
    if (role === "editor") return action === "read" || action === "write";
    return action === "read";
  },
};

describe("handle", () => {
  it("returns 403 when an editor tries to delete", () => {
    expect(handle(authorizer, { role: "editor", action: "delete", resourceId: "doc-9" })).toEqual({
      status: 403,
      body: "editor may not delete",
    });
    expect(handle(authorizer, { role: "admin", action: "delete", resourceId: "doc-9" })).toEqual({
      status: 200,
      body: "delete doc-9",
    });
  });
});
