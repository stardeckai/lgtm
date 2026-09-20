import { describe, expect, it } from "vitest";
import { VisibilityQueue } from "./impl";

describe("VisibilityQueue", () => {
  it("hands a sent message to the first consumer that asks for it", () => {
    const queue = new VisibilityQueue();
    queue.send("msg_1", "resize-image");

    const received = queue.receive(1_000, 30_000);

    expect(received?.body).toBe("resize-image");
    expect(received?.receives).toBe(1);
  });

  it("returns null when the queue is empty", () => {
    expect(new VisibilityQueue().receive(1_000, 30_000)).toBeNull();
  });

  it("stops handing out a message once it has been acked", () => {
    const queue = new VisibilityQueue();
    queue.send("msg_1", "resize-image");
    queue.receive(1_000, 30_000);
    queue.ack("msg_1");

    expect(queue.receive(100_000, 30_000)).toBeNull();
  });
});
