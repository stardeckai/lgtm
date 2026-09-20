export interface Sanitizer {
  clean(html: string): string;
}

const ALLOWED = /^(?:b|i|em|strong|a|p|br)$/;

export const tagAllowlistSanitizer: Sanitizer = {
  clean(html) {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tag: string) =>
        ALLOWED.test(tag.toLowerCase()) ? match.replace(/\son\w+="[^"]*"/gi, "") : "",
      );
  },
};

export type Comment = { authorId: string; bodyHtml: string };

export function renderComment(sanitizer: Sanitizer, comment: Comment): string {
  return `<li data-author="${comment.authorId}">${sanitizer.clean(comment.bodyHtml)}</li>`;
}
