import { describe, expect, it } from "vitest";
import { issueTicket, readTicket } from "./impl";

describe("room tickets", () => {
  it("stops accepting a ticket once its ttl has passed and rejects a swapped room", () => {
    let nowMs = 1_700_000_000_000;
    const clock = () => nowMs;
    const token = issueTicket("sk_room", { userId: "u_7", roomId: "r_2" }, clock, 60);

    expect(readTicket("sk_room", token, clock)).toEqual({ userId: "u_7", roomId: "r_2" });

    const swapped = token.replace("r_2", "r_9");
    expect(readTicket("sk_room", swapped, clock)).toBeNull();

    nowMs += 61_000;
    expect(readTicket("sk_room", token, clock)).toBeNull();
  });
});
