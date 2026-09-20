import { beforeEach, describe, expect, it, vi } from "vitest";
import { sessionTtlSeconds } from "./impl";

vi.mock("./analytics", () => ({ track: vi.fn(), identify: vi.fn(), flush: vi.fn() }));
vi.mock("./mailer", () => ({ sendMail: vi.fn().mockResolvedValue({ id: "msg_1" }) }));
vi.mock("./audit-log", () => ({ record: vi.fn(), query: vi.fn().mockResolvedValue([]) }));
vi.mock("./feature-flags", () => ({ isFlagOn: vi.fn().mockReturnValue(true) }));
vi.mock("./geoip", () => ({ lookup: vi.fn().mockReturnValue({ country: "GB", city: "Leeds" }) }));

const tenant = {
  id: "ten_44",
  name: "Cobalt Health",
  region: "eu-west-2",
  samlEnabled: true,
  scimEnabled: false,
  allowedDomains: ["cobalt.example", "cobalt-health.example"],
  ipAllowList: ["10.0.0.0/8", "192.168.0.0/16"],
};

const device = {
  id: "dev_a1",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  platform: "macos",
  trustedAt: "2024-01-09T08:12:00.000Z",
  fingerprint: "b4c1e9d0f2a3",
};

const actor = { id: "usr_77", tenantId: tenant.id, email: "nina@cobalt.example", roles: ["clinician", "reviewer"] };

beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(new Date("2024-06-01T00:00:00.000Z"));
});

describe("sessionTtlSeconds", () => {
  it("clamps the session to the absolute limit when idle timeout is longer", () => {

    expect(sessionTtlSeconds({ idleMinutes: 720, absoluteHours: 8, rememberDevice: false })).toBe(28800);
  });
});
