import { describe, expect, it } from "vitest";
import { computeContentHash, publishVersion, type DocumentSchema } from "./impl";

describe("document publishing", () => {
  it("stores the content hash of the published schema snapshot", () => {
    const schema: DocumentSchema = {
      slug: "intake",
      version: 3,
      fields: [
        { key: "full_name", label: "Full name", required: true },
        { key: "company", label: "Company", required: false },
      ],
    };

    const published = publishVersion("ver-1", schema);

    expect(published.schemaSnapshot).toEqual(schema);
    expect(published.contentHash).toBe(computeContentHash(published.schemaSnapshot));
  });
});
