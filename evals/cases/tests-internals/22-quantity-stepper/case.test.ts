import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { QuantityStepper } from "./impl";

describe("QuantityStepper", () => {
  it("stops at the stock ceiling and never drops below one", async () => {
    const onChange = vi.fn();
    render(<QuantityStepper max={2} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText("Decrease"));
    expect(screen.getByLabelText("Quantity")).toHaveValue("1");

    await userEvent.click(screen.getByLabelText("Increase"));
    await userEvent.click(screen.getByLabelText("Increase"));

    expect(screen.getByLabelText("Quantity")).toHaveValue("2");
    expect(screen.getByText("Only 2 left in stock")).toBeInTheDocument();
  });
});
