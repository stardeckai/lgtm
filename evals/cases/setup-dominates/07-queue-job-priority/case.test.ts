import { describe, expect, it, vi } from "vitest";
import { priorityOf, type Job } from "./impl";

describe("priorityOf", () => {
  it("caps the retry penalty at twenty points", () => {
    const redis = {
      lpush: vi.fn().mockResolvedValue(1),
      brpoplpush: vi.fn().mockResolvedValue(null),
      zadd: vi.fn().mockResolvedValue(1),
      zrangebyscore: vi.fn().mockResolvedValue([]),
      eval: vi.fn().mockResolvedValue(1),
    };
    const workerPool = {
      size: 12,
      concurrencyPerWorker: 4,
      heartbeatMs: 15_000,
      workers: Array.from({ length: 12 }, (_, i) => ({ id: `w_${i}`, busy: i % 3 === 0, lastBeat: Date.now() })),
    };
    const queues = ["deploy", "email", "report", "cleanup"].map((name) => ({
      name,
      paused: false,
      depth: name === "email" ? 4210 : 12,
      deadLetterDepth: 0,
      rateLimitPerSecond: name === "email" ? 200 : 20,
    }));
    const metrics = { enqueued: 55_120, completed: 54_900, failed: 220, p95Ms: 1840 };
    const job: Job = { id: "job_881", kind: "report", attempts: 9, tenantPlan: "pro" };

    expect(priorityOf(job)).toBe(100);
  });
});
