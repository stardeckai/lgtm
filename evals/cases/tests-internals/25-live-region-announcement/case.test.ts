import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { SaveIndicator } from "./impl";

describe("SaveIndicator", () => {
  it("announces a conflict instead of claiming the changes were saved", async () => {
    render(<SaveIndicator save={vi.fn().mockResolvedValue("conflict")} />);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByText("Someone else edited this page — reload before saving"),
    ).toBeInTheDocument();
    expect(screen.queryByText("All changes saved")).toBeNull();
  });
});
