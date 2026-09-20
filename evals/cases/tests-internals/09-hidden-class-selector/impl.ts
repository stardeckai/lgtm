import React from "react";

export type Upload = { name: string; bytes: number; status: "queued" | "uploading" | "failed" };

const MAX_BYTES = 10 * 1024 * 1024;

export function UploadRow({ upload, onRetry }: { upload: Upload; onRetry: () => void }) {
  const tooBig = upload.bytes > MAX_BYTES;
  return (
    <div className="upload-row">
      <span>{upload.name}</span>
      {tooBig ? (
        <p className="upload-row__error">File is larger than 10 MB</p>
      ) : (
        <p className="upload-row__error is-hidden">File is larger than 10 MB</p>
      )}
      <button className="upload-row__retry" disabled={upload.status !== "failed"} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
