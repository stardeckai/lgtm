import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { PayoutForm } from "./impl";

describe("PayoutForm", () => {
  it("blocks submission while the amount is above the available balance", async () => {
    const onSubmit = vi.fn();
    render(<PayoutForm balanceCents={5_000} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("IBAN"), "TH12345678901234");
    await userEvent.type(screen.getByLabelText("Amount"), "75");

    expect(screen.getByRole("button", { name: "Send payout" })).toBeDisabled();

    await userEvent.clear(screen.getByLabelText("Amount"));
    await userEvent.type(screen.getByLabelText("Amount"), "25");

    expect(screen.getByRole("button", { name: "Send payout" })).toBeEnabled();
  });
});
