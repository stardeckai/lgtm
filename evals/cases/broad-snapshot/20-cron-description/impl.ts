const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function describeCron(expression: string): string {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = expression.trim().split(/\s+/);
  const time = `${hour!.padStart(2, "0")}:${minute!.padStart(2, "0")}`;
  if (dayOfWeek !== "*" && dayOfMonth === "*") {
    const names = dayOfWeek!.split(",").map((d) => DAYS[Number(d)] ?? d);
    return `At ${time} on ${names.join(" and ")}`;
  }
  if (dayOfMonth !== "*") return `At ${time} on day ${dayOfMonth} of ${month === "*" ? "every month" : `month ${month}`}`;
  return `At ${time} every day`;
}
