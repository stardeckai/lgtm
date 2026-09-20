import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { InvoiceActions } from "./impl";

describe("InvoiceActions", () => {
  it("links an issued invoice to its pdf and hides the link while it is a draft", () => {
    const { rerender } = render(
      <InvoiceActions invoice={{ id: "inv-1", number: "2024/07 #3", status: "issued" }} />,
    );
    expect(screen.getByRole("link", { name: "Download PDF" })).toHaveAttribute(
      "href",
      "/api/invoices/inv-1/pdf?v=2024%2F07%20%233",
    );

    rerender(<InvoiceActions invoice={{ id: "inv-1", number: "2024/07 #3", status: "draft" }} />);

    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("PDF available once issued")).toBeInTheDocument();
  });
});
