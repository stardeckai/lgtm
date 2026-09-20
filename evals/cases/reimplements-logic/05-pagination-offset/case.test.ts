import { describe, expect, it } from "vitest";
import { pageWindow } from "./impl";

describe("pageWindow", () => {
  it("clamps the page size at one hundred and offsets from the clamped size", () => {
    const request = { page: 4, size: 250, totalItems: 913 };

    const size = Math.max(1, Math.min(request.size, 100));
    const lastPage = Math.max(1, Math.ceil(request.totalItems / size));
    const page = Math.max(1, Math.min(request.page, lastPage));

    expect(pageWindow(request)).toEqual({
      offset: (page - 1) * size,
      limit: size,
      lastPage,
      hasNext: page < lastPage,
    });
  });
});
