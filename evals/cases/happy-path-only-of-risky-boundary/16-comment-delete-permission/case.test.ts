import { describe, expect, it } from "vitest";
import { deleteComment, type Comment, type Viewer } from "./impl";

const author: Viewer = { id: "usr_1", role: "viewer" };

function comments(): Comment[] {
  return [
    { id: "cmt_1", authorId: "usr_1", body: "first", deleted: false },
    { id: "cmt_2", authorId: "usr_2", body: "second", deleted: false },
  ];
}

describe("deleteComment", () => {
  it("clears the body of the viewer's own comment", () => {
    const rows = comments();

    expect(deleteComment(rows, author, "cmt_1")).toEqual({
      id: "cmt_1",
      authorId: "usr_1",
      body: "",
      deleted: true,
    });
  });

  it("refuses a viewer deleting another member's comment and leaves it intact", () => {
    const rows = comments();

    expect(() => deleteComment(rows, author, "cmt_2")).toThrow("not allowed to delete this comment");
    expect(rows[1]).toEqual({ id: "cmt_2", authorId: "usr_2", body: "second", deleted: false });
  });

  it("lets a moderator delete somebody else's comment", () => {
    expect(deleteComment(comments(), { id: "usr_9", role: "moderator" }, "cmt_2").deleted).toBe(true);
  });
});
