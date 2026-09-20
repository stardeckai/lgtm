export type Attempt = { status: number; errorCode?: string; attempt: number };

export type Outcome = "retry" | "fail" | "drop";

export interface Classifier {
  classify(attempt: Attempt): Outcome;
}

export const httpClassifier: Classifier = {
  classify(attempt) {
    if (attempt.status === 429) return attempt.attempt < 5 ? "retry" : "drop";
    if (attempt.status >= 500) return attempt.attempt < 3 ? "retry" : "fail";
    if (attempt.status === 408 || attempt.errorCode === "ETIMEDOUT") return "retry";
    return attempt.status >= 400 ? "fail" : "drop";
  },
};

export function nextDelayMs(classifier: Classifier, attempt: Attempt): number | null {
  const outcome = classifier.classify(attempt);
  if (outcome !== "retry") return null;
  return Math.min(30_000, 500 * 2 ** attempt.attempt);
}
