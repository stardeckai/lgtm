import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { TicketCard } from "./impl";

describe("TicketCard", () => {
  it("advances an open ticket to in progress and then offers resolving it", async () => {
    render(<TicketCard ticket={{ id: "t-1", state: "open", title: "Printer offline" }} />);
    expect(screen.getByText("Waiting for us")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Advance to In progress" }));

    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Advance to Resolved" })).toBeInTheDocument();
  });
});
