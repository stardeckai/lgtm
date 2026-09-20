import { describe, expect, test } from "vitest";
import { DocStore, type Actor } from "./impl";

describe("DocStore", () => {
  test("shows each tenant only its own documents, by listing and by direct read", () => {
    const store = new DocStore();
    const alphaAdmin: Actor = { id: "usr_a1", tenantId: "ten_alpha", role: "admin" };
    const alphaMember: Actor = { id: "usr_a2", tenantId: "ten_alpha", role: "member" };
    const betaAdmin: Actor = { id: "usr_b1", tenantId: "ten_beta", role: "admin" };
    const gammaMember: Actor = { id: "usr_g1", tenantId: "ten_gamma", role: "member" };
    store.insert({ id: "doc_a1", tenantId: "ten_alpha", title: "Alpha roadmap", ownerId: alphaAdmin.id });
    store.insert({ id: "doc_a2", tenantId: "ten_alpha", title: "Alpha pricing", ownerId: alphaMember.id });
    store.insert({ id: "doc_b1", tenantId: "ten_beta", title: "Beta roadmap", ownerId: betaAdmin.id });
    store.insert({ id: "doc_b2", tenantId: "ten_beta", title: "Beta pricing", ownerId: betaAdmin.id });
    store.insert({ id: "doc_g1", tenantId: "ten_gamma", title: "Gamma notes", ownerId: gammaMember.id });

    expect(store.listVisible(alphaAdmin).map((d) => d.id)).toEqual(["doc_a1", "doc_a2"]);
    expect(store.listVisible(alphaMember).map((d) => d.id)).toEqual(["doc_a1", "doc_a2"]);
    expect(store.listVisible(betaAdmin).map((d) => d.id)).toEqual(["doc_b1", "doc_b2"]);
    expect(store.listVisible(gammaMember).map((d) => d.id)).toEqual(["doc_g1"]);

    expect(store.read(alphaMember, "doc_a2").title).toBe("Alpha pricing");
    expect(() => store.read(alphaAdmin, "doc_b1")).toThrow("not_found");
    expect(() => store.read(betaAdmin, "doc_a1")).toThrow("not_found");
    expect(() => store.read(gammaMember, "doc_b2")).toThrow("not_found");
    expect(() => store.read(betaAdmin, "doc_g1")).toThrow("not_found");
  });
});
