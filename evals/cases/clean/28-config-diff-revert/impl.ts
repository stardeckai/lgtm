export type Config = Record<string, string | number | boolean>;
export type Change = { key: string; from?: Config[string]; to?: Config[string] };

export function diffConfig(before: Config, after: Config): Change[] {
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const changes: Change[] = [];
  for (const key of keys) {
    const had = Object.prototype.hasOwnProperty.call(before, key);
    const has = Object.prototype.hasOwnProperty.call(after, key);
    if (had && has && before[key] === after[key]) continue;
    changes.push({
      key,
      ...(had ? { from: before[key] } : {}),
      ...(has ? { to: after[key] } : {}),
    });
  }
  return changes;
}

export function revert(config: Config, changes: Change[]): Config {
  const out: Config = { ...config };
  for (const change of changes) {
    if (change.from === undefined) delete out[change.key];
    else out[change.key] = change.from;
  }
  return out;
}
