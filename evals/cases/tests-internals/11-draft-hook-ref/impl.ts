import { useCallback, useRef, useState } from "react";

export type Draft = { subject: string; body: string };

export function useMessageDraft(initial: Draft, save: (draft: Draft) => Promise<void>) {
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const inFlight = useRef(0);

  const update = useCallback((patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const flush = useCallback(async () => {
    inFlight.current += 1;
    setStatus("saving");
    try {
      await save(draft);
      setStatus("idle");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current -= 1;
    }
  }, [draft, save]);

  return { draft, status, update, flush, inFlight };
}
