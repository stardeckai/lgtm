import { describe, expect, it } from "vitest";
import { leaderboard } from "./impl";

describe("leaderboard", () => {
  it("breaks a score tie in favour of whoever finished first", () => {
    const result = leaderboard(
      [
        { playerId: "late", score: 90, finishedAtMs: 500 },
        { playerId: "early", score: 90, finishedAtMs: 200 },
        { playerId: "top", score: 120, finishedAtMs: 900 },
        { playerId: "low", score: 10, finishedAtMs: 100 },
      ],
      3,
    );

    expect(result).toEqual(["top", "early", "late"]);
  });
});
