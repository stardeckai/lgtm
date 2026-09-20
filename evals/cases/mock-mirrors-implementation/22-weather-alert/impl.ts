export interface Forecast {
  hourly(stationId: string): Promise<Array<{ hour: number; windKph: number; rainMm: number }>>;
}

export type Alert = { level: "none" | "watch" | "warning"; reasons: string[]; fromHour: number | null };

export async function siteAlert(forecast: Forecast, stationId: string): Promise<Alert> {
  const hours = await forecast.hourly(stationId);
  const windy = hours.filter((h) => h.windKph >= 60);
  const wet = hours.filter((h) => h.rainMm >= 12);
  const reasons: string[] = [];
  if (windy.length > 0) reasons.push("wind");
  if (wet.length > 0) reasons.push("rain");
  if (reasons.length === 0) return { level: "none", reasons, fromHour: null };
  const level = windy.some((h) => h.windKph >= 90) || reasons.length === 2 ? "warning" : "watch";
  const fromHour = Math.min(...[...windy, ...wet].map((h) => h.hour));
  return { level, reasons, fromHour };
}
