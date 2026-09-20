export type Query = { table: string; where: Record<string, unknown>; orderBy?: string; limit?: number };

export function toSql(query: Query): { text: string; values: unknown[] } {
  const values: unknown[] = [];
  const conditions = Object.entries(query.where).map(([column, value]) => {
    values.push(value);
    return `"${column}" = $${values.length}`;
  });
  const parts = [`SELECT * FROM "${query.table}"`];
  if (conditions.length > 0) parts.push(`WHERE ${conditions.join(" AND ")}`);
  if (query.orderBy) parts.push(`ORDER BY "${query.orderBy}" DESC`);
  if (query.limit !== undefined) {
    values.push(query.limit);
    parts.push(`LIMIT $${values.length}`);
  }
  return { text: parts.join(" "), values };
}
