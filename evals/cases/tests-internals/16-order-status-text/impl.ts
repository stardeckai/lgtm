import React, { useState } from "react";

export type Ticket = { id: string; state: "open" | "acknowledged" | "resolved"; title: string };

const NEXT: Record<Ticket["state"], Ticket["state"] | null> = {
  open: "acknowledged",
  acknowledged: "resolved",
  resolved: null,
};

const LABEL: Record<Ticket["state"], string> = {
  open: "Waiting for us",
  acknowledged: "In progress",
  resolved: "Resolved",
};

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const [state, setState] = useState(ticket.state);
  const next = NEXT[state];
  return (
    <article>
      <h4>{ticket.title}</h4>
      <p>{LABEL[state]}</p>
      {next ? <button onClick={() => setState(next)}>Advance to {LABEL[next]}</button> : null}
    </article>
  );
}
