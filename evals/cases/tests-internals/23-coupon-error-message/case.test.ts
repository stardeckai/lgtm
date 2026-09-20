import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CouponBox } from "./impl";

describe("CouponBox", () => {
  it("tells the shopper why an expired coupon was rejected", async () => {
    const redeem = vi.fn().mockResolvedValue({ ok: false, reason: "expired" });
    render(<CouponBox subtotalCents={4_000} redeem={redeem} />);

    await userEvent.type(screen.getByLabelText("Coupon"), " summer24 ");
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(await screen.findByRole("status")).toHaveTextContent("That coupon has expired");
    expect(redeem).toHaveBeenCalledWith("SUMMER24", 4_000);
  });
});
