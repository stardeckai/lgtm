import { store } from "./store";

const RESERVED_KEYS = ["SESSION_SIGNING_KEY", "DATABASE_URL", "INTERNAL_API_KEY"];

export type NewConfigVariable = {
  appId: string;
  key: string;
  value: string;
  targets: string[];
  allowReserved?: boolean;
};

export async function createConfigVariable(input: NewConfigVariable) {
  if (input.targets.length === 0) {
    throw new Error("at least one target is required");
  }
  if (!input.allowReserved && RESERVED_KEYS.includes(input.key.toUpperCase())) {
    throw new Error(`${input.key} is a reserved config key`);
  }
  const duplicate = await store.findByKey(input.appId, input.key);
  if (duplicate) throw new Error(`${input.key} already exists`);

  return store.insert({
    appId: input.appId,
    key: input.key,
    value: `enc:${input.value}`,
    targets: input.targets,
  });
}
