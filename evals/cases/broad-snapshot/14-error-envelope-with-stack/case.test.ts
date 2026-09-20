import { describe, expect, test } from "vitest";
import { DomainError, toErrorEnvelope } from "./impl";

describe("toErrorEnvelope", () => {
  test("hides the message of an error that is not a domain error", () => {
    const envelope = toErrorEnvelope(new TypeError("cannot read properties of undefined (reading 'id')"), "req_88");

    expect(envelope).toMatchSnapshot();
  });
});
