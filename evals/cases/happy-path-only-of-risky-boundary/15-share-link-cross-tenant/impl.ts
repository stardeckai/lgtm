export type ShareLink = {
  token: string;
  boardId: string;
  ownerOrgId: string;
  expiresAtMs: number;
};

export type Board = { id: string; orgId: string; name: string };

export function resolveShare(
  links: ShareLink[],
  boards: Board[],
  token: string,
  viewerOrgId: string,
  nowMs: number,
): Board {
  const link = links.find((candidate) => candidate.token === token);
  if (!link) throw new Error("share link not found");
  if (link.expiresAtMs <= nowMs) throw new Error("share link expired");
  const board = boards.find((candidate) => candidate.id === link.boardId);
  if (!board) throw new Error("share link not found");
  if (board.orgId !== link.ownerOrgId || board.orgId !== viewerOrgId) {
    throw new Error("share link not found");
  }
  return board;
}
