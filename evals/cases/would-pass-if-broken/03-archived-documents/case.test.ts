import { describe, expect, it } from "vitest";
import { visibleDocuments, type Doc } from "./impl";

const docs: Doc[] = [
  { id: "d1", title: "Onboarding plan", archived: false, updatedAt: 30 },
  { id: "d2", title: "Onboarding notes", archived: false, updatedAt: 10 },
  { id: "d3", title: "Onboarding budget", archived: false, updatedAt: 20 },
];

describe("visibleDocuments", () => {
  it("leaves archived documents out of the result", () => {
    const result = visibleDocuments(docs, "onboarding");

    expect(result.map((doc) => doc.id)).toEqual(["d1", "d3", "d2"]);
  });
});
