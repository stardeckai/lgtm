import type { Check } from "../types.js";

export default {
  id: "broad-snapshot",
  emoji: "📸",
  blurb: "The snapshot pins everything and explains nothing, so it will be re-recorded on the next change.",
  instructions:
    "Gate 1 — is a recording compared? Only yes if `test_code` checks the output of the code under test against a recorded artifact: `toMatchSnapshot`, `toMatchInlineSnapshot`, `toMatchFileSnapshot`, a committed golden file, or a frozen opaque digest or byte constant captured from a past run. Answer no otherwise, whatever it is called: a hand-written `toEqual`/`toBe` literal, however large; a helper, field or variable merely named snapshot; two live values compared to each other (before/after, restart vs start, channel A vs B, two maintained sources); a format regex over a hash. Gate 2 — does that recording carry many fields, rows, lines or markup past the one distinction the test name states, or collapse everything into one digest? A recorded scalar or few lines that show the named behavior on sight is no.",
  criteria: {
    true: "The expected value is a recorded artifact — snapshot, golden file or frozen digest — of output far wider than the behavior the name claims.",
    false: "No recording is compared (a hand-written literal, an identifier merely named snapshot, or two live values checked against each other), or the recorded value is short enough to read the named behavior off the diff.",
  },
  threshold: 0.35,
} satisfies Check;
