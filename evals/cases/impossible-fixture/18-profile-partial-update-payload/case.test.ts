import { describe, expect, it } from "vitest";
import { applyProfileUpdate, type Profile, type ProfileUpdate } from "./impl";

describe("applyProfileUpdate", () => {
  it("changes only the fields the payload mentions", () => {
    const current: Profile = {
      id: "usr_5",
      displayName: "Kim",
      timezone: "Asia/Bangkok",
      marketingOptIn: true,
    };
    const update: ProfileUpdate = { timezone: "Europe/Berlin" };

    expect(applyProfileUpdate(current, update)).toEqual({
      id: "usr_5",
      displayName: "Kim",
      timezone: "Europe/Berlin",
      marketingOptIn: true,
    });
  });
});
