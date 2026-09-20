import { describe, expect, it } from "vitest";
import { normalize, type ApiTicket } from "./impl";

describe("normalize", () => {
  it("deduplicates repeated tags on a ticket", () => {
    const tickets: ApiTicket[] = [
      {
        id: "tk_1",
        subject: "Card declined",
        requester: { id: "u_1", name: "Ivy Chen", email: "ivy@example.com" },
        assignee: { id: "u_2", name: "Sam Ross", email: "sam@example.com" },
        tags: ["billing", "urgent", "billing"],
        comments: [
          { id: "cm_1", authorId: "u_1", body: "My card was declined twice.", at: "2024-02-01T09:00:00.000Z" },
          { id: "cm_2", authorId: "u_2", body: "Looking into it now.", at: "2024-02-01T09:05:00.000Z" },
        ],
      },
      {
        id: "tk_2",
        subject: "Export never finished",
        requester: { id: "u_3", name: "Noor Ali", email: "noor@example.com" },
        assignee: null,
        tags: ["exports"],
        comments: [{ id: "cm_3", authorId: "u_3", body: "Still spinning after an hour.", at: "2024-02-02T14:00:00.000Z" }],
      },
    ];

    expect(normalize(tickets)).toMatchSnapshot();
  });
});
