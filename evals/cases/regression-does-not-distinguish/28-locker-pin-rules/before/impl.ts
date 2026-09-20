export function lockerLabel(row: number, column: number): string {
  return `${String.fromCharCode(64 + row)}${column}`;
}
