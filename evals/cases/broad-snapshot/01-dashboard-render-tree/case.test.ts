import { describe, expect, it } from "vitest";
import { renderDashboard, type Widget } from "./impl";

describe("renderDashboard", () => {
  it("lays a three-column widget out across the full row", () => {
    const widgets: Widget[] = [
      { id: "w1", kind: "stat", title: "Revenue", span: 1 },
      { id: "w2", kind: "stat", title: "Churn", span: 1 },
      { id: "w3", kind: "chart", title: "Signups over time", span: 3 },
      { id: "w4", kind: "table", title: "Recent orders", span: 2 },
    ];

    expect(renderDashboard(widgets)).toMatchSnapshot();
  });
});
