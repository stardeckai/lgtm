import { beforeEach, describe, expect, it } from "vitest";
import { NotificationStore } from "./impl";

let store: NotificationStore;

beforeEach(() => {
  store = new NotificationStore();
  store.push("usr_1", "mention");
  store.push("usr_1", "assignment");
  store.push("usr_2", "mention");
});

describe("NotificationStore", () => {
  it("drops a notification from the unread list once it has been read", () => {
    store.markRead("ntf_1", 1_700_000_000_000);

    expect(store.unreadFor("usr_1")).toEqual([
      { id: "ntf_2", userId: "usr_1", kind: "assignment", readAt: null },
    ]);
  });
});
