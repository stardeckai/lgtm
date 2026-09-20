export type Appointment = { id: string; startsAtMs: number; reminderSentAtMs: number | null };

export type Reminder = { appointmentId: string; sendAtMs: number };

const LEAD_MS = 24 * 60 * 60 * 1000;

export class Scheduler {
  readonly outbox: Reminder[] = [];

  constructor(private readonly appointments: Appointment[]) {}

  run(nowMs: number): void {
    for (const appointment of this.appointments) {
      if (appointment.reminderSentAtMs !== null) continue;
      if (appointment.startsAtMs - nowMs > LEAD_MS) continue;
      if (appointment.startsAtMs <= nowMs) continue;
      this.outbox.push({ appointmentId: appointment.id, sendAtMs: nowMs });
      appointment.reminderSentAtMs = nowMs;
    }
  }
}
