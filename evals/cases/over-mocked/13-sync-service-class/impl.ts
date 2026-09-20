export interface SheetsApi {
  readRange(sheetId: string, range: string): Promise<string[][]>;
}
export interface RowStore {
  upsert(rows: { externalId: string; values: Record<string, string> }[]): Promise<number>;
}
export interface Mapper {
  toRows(header: string[], body: string[][]): { externalId: string; values: Record<string, string> }[];
}

export class SheetSync {
  constructor(
    private readonly sheets: SheetsApi,
    private readonly store: RowStore,
    private readonly mapper: Mapper,
  ) {}

  async run(sheetId: string): Promise<{ imported: number; skipped: number }> {
    const grid = await this.sheets.readRange(sheetId, "A1:Z1000");
    const [header, ...body] = grid;
    if (!header) return { imported: 0, skipped: 0 };
    const rows = this.mapper.toRows(header, body);
    const imported = await this.store.upsert(rows);
    return { imported, skipped: body.length - rows.length };
  }
}
