export type ImportJob = {
  id: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
  finishedAt: number | null;
};

export function startImport(id: string, totalRows: number): ImportJob {
  if (totalRows < 0) throw new Error("totalRows cannot be negative");
  return { id, totalRows, processedRows: 0, failedRows: 0, finishedAt: null };
}

export function recordRow(job: ImportJob, ok: boolean): ImportJob {
  if (job.processedRows >= job.totalRows) throw new Error("import already consumed every row");
  return {
    ...job,
    processedRows: job.processedRows + 1,
    failedRows: job.failedRows + (ok ? 0 : 1),
  };
}

export function progressPercent(job: ImportJob): number {
  if (job.totalRows === 0) return 100;
  return Math.floor((job.processedRows / job.totalRows) * 100);
}
