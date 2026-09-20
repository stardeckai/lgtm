import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockFindByKey, mockInsert } = vi.hoisted(() => ({
  mockFindByKey: vi.fn(),
  mockInsert: vi.fn(),
}));

vi.mock("./store", () => ({
  store: {
    findByKey: (...args: unknown[]) => mockFindByKey(...args),
    insert: (...args: unknown[]) => mockInsert(...args),
  },
}));

import { createConfigVariable } from "./impl";

const BASE = { appId: "app_1", value: "v", targets: ["production"] };

beforeEach(() => {
  vi.clearAllMocks();
  mockFindByKey.mockResolvedValue(null);
  mockInsert.mockResolvedValue({ id: "cfg_new", key: "OK_KEY" });
});

describe("createConfigVariable", () => {
  it("leaves ordinary keys alone", async () => {
    await expect(createConfigVariable({ ...BASE, key: "MY_API_KEY" })).resolves.toBeDefined();
    expect(mockInsert).toHaveBeenCalled();
  });
});
