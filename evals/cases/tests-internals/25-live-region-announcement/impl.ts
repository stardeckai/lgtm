import React, { useState } from "react";

export type SaveState = "idle" | "saving" | "saved" | "conflict";

const ANNOUNCEMENT: Record<SaveState, string> = {
  idle: "",
  saving: "Saving your changes",
  saved: "All changes saved",
  conflict: "Someone else edited this page — reload before saving",
};

export function SaveIndicator({ save }: { save: () => Promise<"saved" | "conflict"> }) {
  const [state, setState] = useState<SaveState>("idle");
  return (
    <div>
      <button
        onClick={async () => {
          setState("saving");
          setState(await save());
        }}
      >
        Save
      </button>
      <p aria-live="polite">{ANNOUNCEMENT[state]}</p>
    </div>
  );
}
