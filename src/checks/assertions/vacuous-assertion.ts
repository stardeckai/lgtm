import type { Check } from "../types.js";

export default {
  id: "vacuous-assertion",
  emoji: "🤏",
  blurb: "This assertion proves this much.",
  instructions:
    "Are the assertions in `test_code` ones that almost any outcome satisfies — toBeDefined, toBeTruthy, length >= 0, not.toThrow with nothing else asserted, status !== 500, or 'greater than some older value'?",
  criteria: {
    true: "The assertions accept a wide range of wrong outputs as well as the right one.",
    false: "The assertions pin an exact value, shape or error that a plausible bug would violate.",
  },
  threshold: 0.30,
} satisfies Check;
