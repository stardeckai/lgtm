export type Step<T> = {
  name: string;
  run: (state: T) => T;
  compensate: (state: T) => T;
};

export type SagaResult<T> = { ok: true; state: T; ran: string[] } | { ok: false; state: T; failedAt: string; compensated: string[] };

export function runSaga<T>(initial: T, steps: Step<T>[]): SagaResult<T> {
  let state = initial;
  const ran: string[] = [];
  for (const step of steps) {
    try {
      state = step.run(state);
      ran.push(step.name);
    } catch {
      const compensated: string[] = [];
      for (const done of [...ran].reverse()) {
        const target = steps.find((s) => s.name === done)!;
        state = target.compensate(state);
        compensated.push(done);
      }
      return { ok: false, state, failedAt: step.name, compensated };
    }
  }
  return { ok: true, state, ran };
}
