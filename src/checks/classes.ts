/** Not a finding — what kind of test this is. lgtm likes `contract_integration`. */
export const TEST_CLASSES = {
  pure_logic:
    "One unit — a single function, or a single class/module — is exercised directly; writing through one method and reading back through another method of the same class still counts. No collaborator of that unit takes part, real or faked, apart from fakes standing in for true external edges (clock, randomness, network/HTTP, a third-party gateway, the file system).",
  mocked_seam_unit:
    "At least one collaborator of the code under test — something application code would implement, such as a repository, store, policy, encoder or notifier — is replaced by a mock, stub, spy or hand-written fake whose behaviour the test defines. Faking only true external edges (clock, randomness, network/HTTP, a third-party gateway, the file system) does not count as this.",
  contract_integration:
    "Two or more distinct real components of the code under test — separate functions, classes or modules that each carry their own logic (encoder+decoder, signer+verifier, store+service, producer+queue+consumer, policy+handler) — run together with fakes only at true external edges, and the assertion depends on their agreeing.",
} as const;

export type TestClass = keyof typeof TEST_CLASSES;

export const CLASS_EMOJI: Record<TestClass, string> = {
  contract_integration: "🎯",
  mocked_seam_unit: "🧱",
  pure_logic: "🔬",
};
