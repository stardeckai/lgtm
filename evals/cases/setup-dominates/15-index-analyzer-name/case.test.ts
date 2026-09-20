import { describe, expect, it } from "vitest";
import { analyzerFor } from "./impl";

const MAPPING = {
  properties: {
    title: { type: "text", boost: 3 },
    body: { type: "text" },
    tags: { type: "keyword" },
    publishedAt: { type: "date" },
    authorId: { type: "keyword" },
    viewCount: { type: "integer" },
  },
};

const DOCUMENTS = Array.from({ length: 30 }, (_, i) => ({
  id: `doc_${i}`,
  title: `Release notes ${i}`,
  body: "We shipped incremental improvements to the ingestion pipeline.",
  tags: i % 2 === 0 ? ["release", "pipeline"] : ["release"],
  publishedAt: `2024-0${(i % 9) + 1}-15T00:00:00.000Z`,
  authorId: `usr_${i % 4}`,
  viewCount: 100 + i * 13,
  language: i % 5 === 0 ? "de" : "en",
}));

describe("analyzerFor", () => {
  it("prefers the CJK analyzer over the declared language", () => {
    const index = { name: "articles_v7", shards: 3, replicas: 1, refreshInterval: "5s", mapping: MAPPING };
    const bulkBody = DOCUMENTS.flatMap((doc) => [{ index: { _index: index.name, _id: doc.id } }, doc]);
    const aggregations = {
      byTag: { terms: { field: "tags", size: 20 } },
      byMonth: { date_histogram: { field: "publishedAt", calendar_interval: "month" } },
    };

    expect(analyzerFor("de", true)).toBe("kuromoji");
  });
});
