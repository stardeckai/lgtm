import { describe, expect, it } from "vitest";
import { formatLine, parseLine, type LogRecord } from "./impl";

describe("log lines", () => {
  it("survives a message containing spaces, quotes and an equals sign", () => {
    const record: LogRecord = {
      level: "warn",
      message: 'retry after "429" rate=limited',
      fields: { attempt: 3, route: "/v1/orders" },
    };

    const line = formatLine(record);

    expect(line).toBe('level=warn msg="retry after \\"429\\" rate=limited" attempt=3 route="/v1/orders"');
    expect(parseLine(line)).toEqual(record);
  });
});
