import { describe, expect, it } from "vitest";
import { TicketStore } from "./impl";

describe("TicketStore.listOpen", () => {
  it("returns only the tickets that belong to the requesting tenant", () => {
    const store = new TicketStore();
    store.insert({ id: "t1", tenantId: "acme", subject: "Printer", closed: false });
    store.insert({ id: "t2", tenantId: "acme", subject: "Badge", closed: true });
    store.insert({ id: "t3", tenantId: "acme", subject: "Laptop", closed: false });

    expect(store.listOpen("acme").map((row) => row.id)).toEqual(["t1", "t3"]);
  });
});
