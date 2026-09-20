import { describe, expect, it } from "vitest";
import { book, InMemoryReservations } from "./impl";

describe("book", () => {
  it("refuses a reservation that overlaps an existing one but allows a back-to-back slot", () => {
    const repo = new InMemoryReservations();

    expect(book(repo, { id: "r-1", roomId: "room-a", from: 100, to: 200 })).toBe("booked");
    expect(book(repo, { id: "r-2", roomId: "room-a", from: 150, to: 250 })).toBe("conflict");
    expect(book(repo, { id: "r-3", roomId: "room-a", from: 200, to: 300 })).toBe("booked");
    expect(book(repo, { id: "r-4", roomId: "room-b", from: 150, to: 250 })).toBe("booked");
    expect(repo.forRoom("room-a").map((r) => r.id)).toEqual(["r-1", "r-3"]);
  });
});
