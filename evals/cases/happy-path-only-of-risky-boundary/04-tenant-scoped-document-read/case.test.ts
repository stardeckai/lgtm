import { describe, expect, it } from "vitest";
import { DocumentRepository } from "./impl";

describe("DocumentRepository", () => {
  it("returns the document with the requested id", () => {
    const repo = new DocumentRepository();
    repo.add({ id: "doc_1", orgId: "org_a", title: "Runbook", body: "restart the worker" });

    expect(repo.read("org_a", "doc_1")).toEqual({
      id: "doc_1",
      orgId: "org_a",
      title: "Runbook",
      body: "restart the worker",
    });
  });

  it("lists the documents that belong to the organisation", () => {
    const repo = new DocumentRepository();
    repo.add({ id: "doc_1", orgId: "org_a", title: "Runbook", body: "" });
    repo.add({ id: "doc_2", orgId: "org_a", title: "Onboarding", body: "" });

    expect(repo.list("org_a").map((doc) => doc.id)).toEqual(["doc_1", "doc_2"]);
  });

  it("throws for an id that does not exist at all", () => {
    const repo = new DocumentRepository();

    expect(() => repo.read("org_a", "doc_missing")).toThrow();
  });
});
