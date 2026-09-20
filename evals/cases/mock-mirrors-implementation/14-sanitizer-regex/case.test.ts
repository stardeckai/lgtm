import { describe, expect, it } from "vitest";
import { renderComment, type Comment, type Sanitizer } from "./impl";

const allowed = /^(?:b|i|em|strong|a|p|br)$/;

const sanitizer: Sanitizer = {
  clean(html) {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tag: string) =>
        allowed.test(tag.toLowerCase()) ? match.replace(/\son\w+="[^"]*"/gi, "") : "",
      );
  },
};

const comment: Comment = {
  authorId: "u_5",
  bodyHtml: '<p onclick="steal()">hi <script>alert(1)</script><img src=x> <b>there</b></p>',
};

describe("renderComment", () => {
  it("drops script blocks, unknown tags and inline event handlers", () => {
    expect(renderComment(sanitizer, comment)).toBe(
      '<li data-author="u_5"><p>hi  <b>there</b></p></li>',
    );
  });
});
