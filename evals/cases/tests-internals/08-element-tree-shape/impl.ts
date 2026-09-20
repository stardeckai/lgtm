import React from "react";

export type Notification = { id: string; title: string; readAt: string | null };

export function NotificationList({
  items,
  onOpen,
}: {
  items: Notification[];
  onOpen: (id: string) => void;
}) {
  const unread = items.filter((i) => i.readAt === null);
  if (items.length === 0) return <p>You are all caught up</p>;
  return (
    <div>
      <h3>{unread.length > 0 ? `${unread.length} unread` : "No unread notifications"}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <button onClick={() => onOpen(item.id)}>{item.title}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
