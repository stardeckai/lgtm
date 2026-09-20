import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useMessageDraft } from "./impl";

describe("useMessageDraft", () => {
  it("keeps the draft saveable while a save is in flight", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useMessageDraft({ subject: "Hi", body: "" }, save));

    await act(async () => {
      await result.current.flush();
    });

    expect(result.current.inFlight.current).toBe(0);
  });
});
