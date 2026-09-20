export type Check = {
  id: string;
  /** the glyph after the 😐 face for this check */
  emoji: string;
  /** the one-liner printed under a finding, in --list-checks and in the Claude skill */
  blurb: string;
  instructions: string;
  criteria?: { true: string; false: string };
  threshold: number;
  /** only sent when `diff` is part of the state */
  diffOnly?: true;
};

export const DEFAULT_THRESHOLD = 0.8;
