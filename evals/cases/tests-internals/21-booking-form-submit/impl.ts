import React, { useState } from "react";

export type Booking = { staffId: string; startsAt: string; durationMin: number; notes?: string };

export function BookingForm({
  staff,
  onBook,
}: {
  staff: { id: string; name: string }[];
  onBook: (booking: Booking) => void;
}) {
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");
  const [startsAt, setStartsAt] = useState("");
  const [duration, setDuration] = useState("30");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onBook({ staffId, startsAt: new Date(startsAt).toISOString(), durationMin: Number(duration) });
      }}
    >
      <label htmlFor="staff">Staff</label>
      <select id="staff" value={staffId} onChange={(e) => setStaffId(e.target.value)}>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <label htmlFor="starts">Starts at</label>
      <input id="starts" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
      <label htmlFor="duration">Duration</label>
      <input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
      <button type="submit">Book</button>
    </form>
  );
}
