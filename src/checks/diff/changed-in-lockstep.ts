import type { Check } from "../types.js";

export default {
  id: "changed-in-lockstep",
  emoji: "🧑‍🍳",
  blurb: "Implementation and expected values changed together, so the test may only mirror the new behaviour.",
  instructions:
    "In `diff`, were the implementation and the test changed in the same way, so the test may simply mirror the new behavior (including a bug) rather than check a requirement?",
  criteria: {
    true: "The test's expectations were edited to match the new implementation output.",
    false: "The test expresses a requirement that was decided independently of the implementation change.",
  },
  threshold: 0.70,
  diffOnly: true,
} satisfies Check;
