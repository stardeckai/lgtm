export type Comment = { id: string; authorId: string; body: string; deleted: boolean };
export type Viewer = { id: string; role: "viewer" | "editor" | "moderator" };

export function deleteComment(comments: Comment[], viewer: Viewer, commentId: string): Comment {
  const comment = comments.find((candidate) => candidate.id === commentId);
  if (!comment) throw new Error(`unknown comment ${commentId}`);
  const own = comment.authorId === viewer.id;
  if (!own && viewer.role !== "moderator") throw new Error("not allowed to delete this comment");
  comment.deleted = true;
  comment.body = "";
  return comment;
}
