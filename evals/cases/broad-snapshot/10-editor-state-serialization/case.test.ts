import { describe, expect, test } from "vitest";
import { serializeState, type EditorState } from "./impl";

describe("serializeState", () => {
  test("defaults a todo block with no checked flag to unchecked", () => {
    const state: EditorState = {
      docId: "doc_55",
      undoDepth: 7,
      selection: { blockId: "b3", offset: 4 },
      blocks: [
        { id: "b1", type: "heading", text: "Release checklist" },
        { id: "b2", type: "paragraph", text: "Everything below must be green before we ship." },
        { id: "b3", type: "todo", text: "Run the migration" },
        { id: "b4", type: "todo", text: "Rotate the signing key", checked: true },
      ],
    };

    expect(serializeState(state)).toMatchInlineSnapshot(`
      {
        "blocks": [
          {
            "id": "b1",
            "text": "Release checklist",
            "type": "heading",
          },
          {
            "id": "b2",
            "text": "Everything below must be green before we ship.",
            "type": "paragraph",
          },
          {
            "checked": false,
            "id": "b3",
            "text": "Run the migration",
            "type": "todo",
          },
          {
            "checked": true,
            "id": "b4",
            "text": "Rotate the signing key",
            "type": "todo",
          },
        ],
        "counts": {
          "blocks": 4,
          "words": 17,
        },
        "cursor": {
          "block": "b3",
          "offset": 4,
        },
        "docId": "doc_55",
        "revision": 7,
      }
    `);
  });
});
