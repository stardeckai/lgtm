import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { StatusBadge } from "./impl";

describe("StatusBadge", () => {
  it("shows a critical badge with a capped count", () => {
    const { container } = render(<StatusBadge severity="critical" count={42} />);

    expect(container.firstChild).toHaveClass("badge", "badge--critical", "badge--wide");
  });
});
