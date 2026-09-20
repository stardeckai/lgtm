import { describe, expect, it, vi } from "vitest";
import { getContextParts, type ContextStore } from "./impl";

function fakeStore(rows: { defaults: string | null }[]) {
  const findChannelDefaults = vi.fn().mockResolvedValue(rows);
  return { store: { findChannelDefaults } as ContextStore, findChannelDefaults };
}

describe("getContextParts", () => {
  it("suppresses the channel defaults for a scoped agent, without looking them up", async () => {
    const { store, findChannelDefaults } = fakeStore([{ defaults: "legacy chat channel blurb" }]);

    const parts = await getContextParts(store, "ws_1", "chat", "per-conversation note", false);

    expect(findChannelDefaults).not.toHaveBeenCalled();
    expect(parts.defaultContext).toBeNull();
    expect(parts.chatContext).toBe("per-conversation note");
  });
});
