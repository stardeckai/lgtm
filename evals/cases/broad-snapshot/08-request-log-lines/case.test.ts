import { describe, expect, it } from "vitest";
import { formatLines, type LogRecord } from "./impl";

describe("formatLines", () => {
  it("replaces the value of every redacted field", () => {
    const records: LogRecord[] = [
      {
        at: "2024-08-01T10:00:00.000Z",
        level: "info",
        msg: "request.start",
        fields: { method: "POST", path: "/v1/sessions", requestId: "req_1", authorization: "Bearer abc123" },
      },
      {
        at: "2024-08-01T10:00:00.140Z",
        level: "debug",
        msg: "db.query",
        fields: { sql: "select 1", durationMs: 4, password: "hunter2" },
      },
      {
        at: "2024-08-01T10:00:00.210Z",
        level: "warn",
        msg: "request.slow",
        fields: { method: "POST", path: "/v1/sessions", durationMs: 210, requestId: "req_1" },
      },
    ];

    expect(formatLines(records, ["authorization", "password"])).toMatchSnapshot();
  });
});
