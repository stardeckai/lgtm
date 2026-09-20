import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { NotificationList } from "./impl";

describe("NotificationList", () => {
  it("counts the unread notifications", () => {
    const { container } = render(
      <NotificationList
        items={[
          { id: "n-1", title: "Deploy finished", readAt: null },
          { id: "n-2", title: "Invoice paid", readAt: "2024-02-02T00:00:00.000Z" },
        ]}
        onOpen={vi.fn()}
      />,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("DIV");
    expect(root.children[0]!.tagName).toBe("H3");
    expect(root.children[1]!.children).toHaveLength(2);
  });
});
