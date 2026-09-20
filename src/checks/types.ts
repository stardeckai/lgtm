export type Check = {
  id: string;
  /** the glyph after the 😐 face for this check */
  /** the one-liner printed under a finding, in --list-checks and in the Claude skill */
  blurb: string;
  instructions: string;
  criteria?: { true: string; false: string };
  threshold: number;
  /** the high-confidence line, when it is not threshold + the standard margin (see report.ts CERTAIN_MARGIN) */
  high?: number;
  /** set by hand and left alone by `pnpm eval --fit-thresholds --write`; say why in a comment next to it */
  pinned?: true;
  /** the instructions ask the opposite question (is the test sound?) and the answer is flipped: Jev is
   *  conservative on "yes", so a check phrased as "does this test catch the break?" puts its confident answers
   *  on the sound tests and the smell score is 1 − that. */
  invert?: true;
  /** only sent when `diff` is part of the state */
  diffOnly?: true;
};

export const DEFAULT_THRESHOLD = 0.8;
