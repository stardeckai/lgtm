import { describe, expect, it } from "vitest";
import { Analytics, type AnalyticsTransport } from "./impl";

describe("Analytics.track", () => {
  it("forwards the event name and properties to the transport", () => {
    const sent: { event: string; properties: Record<string, unknown> }[] = [];
    const transport: AnalyticsTransport = {
      send: (event, properties) => {
        sent.push({ event, properties });
      },
    };

    new Analytics(transport).track("page_viewed", { path: "/pricing" });

    expect(sent).toEqual([{ event: "page_viewed", properties: { path: "/pricing" } }]);
  });
});
