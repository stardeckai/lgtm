import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { OrdersDashboard } from "./impl";

vi.mock("./use-org-context", () => ({ useOrgContext: () => ({ orgName: "Northwind" }) }));
vi.mock("./use-currency", () => ({ useCurrency: () => () => "฿120.00" }));
vi.mock("./use-orders", () => ({
  useOrders: () => ({ data: [], isPending: false, error: null }),
}));

describe("OrdersDashboard", () => {
  it("summarises the open orders for the organisation", () => {
    render(<OrdersDashboard />);

    expect(screen.getByRole("heading", { name: "Northwind" })).toBeInTheDocument();
    expect(screen.getByText("0 open orders worth ฿120.00")).toBeInTheDocument();
  });
});
