export type Block = { id: string; type: "paragraph" | "heading" | "todo"; text: string; checked?: boolean };
export type EditorState = { docId: string; blocks: Block[]; selection: { blockId: string; offset: number }; undoDepth: number };

export function serializeState(state: EditorState) {
  return {
    docId: state.docId,
    revision: state.undoDepth,
    blocks: state.blocks.map((block) => ({
      id: block.id,
      type: block.type,
      text: block.text,
      ...(block.type === "todo" ? { checked: block.checked === true } : {}),
    })),
    cursor: { block: state.selection.blockId, offset: state.selection.offset },
    counts: {
      blocks: state.blocks.length,
      words: state.blocks.reduce((sum, b) => sum + b.text.split(/\s+/).filter(Boolean).length, 0),
    },
  };
}
