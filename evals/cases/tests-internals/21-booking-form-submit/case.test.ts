import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { BookingForm } from "./impl";

describe("BookingForm", () => {
  it("books the selected stylist at the chosen time in utc", async () => {
    const onBook = vi.fn();
    render(
      <BookingForm
        staff={[
          { id: "s-1", name: "Nok" },
          { id: "s-2", name: "Ploy" },
        ]}
        onBook={onBook}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Staff"), "s-2");
    await userEvent.type(screen.getByLabelText("Starts at"), "2024-08-01T09:30:00Z");
    await userEvent.clear(screen.getByLabelText("Duration"));
    await userEvent.type(screen.getByLabelText("Duration"), "45");
    await userEvent.click(screen.getByRole("button", { name: "Book" }));

    expect(onBook).toHaveBeenCalledWith({
      staffId: "s-2",
      startsAt: "2024-08-01T09:30:00.000Z",
      durationMin: 45,
    });
  });
});
