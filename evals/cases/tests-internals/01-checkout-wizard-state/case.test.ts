import { describe, expect, it, vi } from "vitest";
import { create } from "react-test-renderer";
import React from "react";
import { CheckoutWizard } from "./impl";

describe("CheckoutWizard", () => {
  it("moves the shopper to the next step", () => {
    const tree = create(
      <CheckoutWizard steps={["Address", "Payment", "Review"]} onDone={vi.fn()} />,
    );
    const instance = tree.root.instance as CheckoutWizard;

    instance.next();

    expect(instance.state.step).toBe(1);
    expect(instance.state.visited).toEqual([0, 1]);
  });
});
