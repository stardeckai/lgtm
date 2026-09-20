import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFilteredRows, type Row } from "./impl";

describe("useFilteredRows", () => {
  it("hides archived rows unless they are asked for", () => {
    const rows: Row[] = [
      { id: "1", label: "Alpha", archived: false },
      { id: "2", label: "Beta", archived: true },
    ];
    let renders = 0;
    const { result } = renderHook(() => {
      renders++;
      return useFilteredRows(rows);
    });

    act(() => result.current.setShowArchived(true));

    expect(renders).toBe(2);
  });
});
