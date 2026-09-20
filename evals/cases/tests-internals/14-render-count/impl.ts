import { useMemo, useState } from "react";

export type Row = { id: string; label: string; archived: boolean };

export function useFilteredRows(rows: Row[]) {
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(
      (r) => (showArchived || !r.archived) && (needle === "" || r.label.toLowerCase().includes(needle)),
    );
  }, [rows, query, showArchived]);

  return { visible, query, setQuery, showArchived, setShowArchived };
}
