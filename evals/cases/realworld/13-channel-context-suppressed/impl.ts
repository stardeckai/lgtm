export type ContextStore = {
  findChannelDefaults: (workspaceId: string, channel: string) => Promise<{ defaults: string | null }[]>;
};

export type ContextParts = {
  defaultContext: string | null;
  chatContext: string | null;
};

export async function getContextParts(
  store: ContextStore,
  workspaceId: string,
  channel: string | null,
  chatNote: string | null,
  includeChannelDefaults: boolean
): Promise<ContextParts> {
  if (!includeChannelDefaults || !channel) {
    return { defaultContext: null, chatContext: chatNote };
  }
  const rows = await store.findChannelDefaults(workspaceId, channel);
  return { defaultContext: rows[0]?.defaults ?? null, chatContext: chatNote };
}
