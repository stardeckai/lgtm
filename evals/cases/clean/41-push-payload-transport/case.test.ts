import { describe, expect, it, vi } from "vitest";
import { push, type Device, type Notification } from "./impl";

describe("push", () => {
  it("sends the platform's own envelope shape with the strings rendered in the device locale", async () => {
    const send = vi.fn(async () => {});
    const notification: Notification = {
      titleKey: "order.shipped.title",
      bodyKey: "order.shipped.body",
      args: { id: "A-17" },
      badge: 3,
    };
    const ios: Device = { token: "tok-ios", platform: "ios", locale: "de" };
    const android: Device = { token: "tok-android", platform: "android", locale: "fr" };

    await push(send, ios, notification);
    await push(send, android, notification);

    expect(send).toHaveBeenNthCalledWith(1, {
      token: "tok-ios",
      aps: { alert: { title: "Unterwegs", body: "Bestellung A-17 hat das Lager verlassen" }, badge: 3 },
    });
    expect(send).toHaveBeenNthCalledWith(2, {
      token: "tok-android",
      notification: { title: "On its way", body: "Order A-17 left the warehouse" },
      data: { id: "A-17" },
    });
  });
});
