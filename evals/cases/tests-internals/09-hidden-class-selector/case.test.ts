import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { UploadRow } from "./impl";

describe("UploadRow", () => {
  it("warns when the chosen file is over the size limit", () => {
    const { container } = render(
      <UploadRow upload={{ name: "clip.mov", bytes: 12 * 1024 * 1024, status: "queued" }} onRetry={vi.fn()} />,
    );

    expect(container.querySelector(".upload-row__error.is-hidden")).toBeNull();
    expect(container.querySelector(".upload-row__error")).not.toBeNull();
  });
});
