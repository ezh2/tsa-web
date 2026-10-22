export const EVENT_TIME_ZONES = ["America/Chicago", "Asia/Taipei", "UTC"] as const;
export type EventTimeZone = (typeof EVENT_TIME_ZONES)[number];

export function isEventTimeZone(zone: string): zone is EventTimeZone {
  return EVENT_TIME_ZONES.some((candidate) => candidate === zone);
}

export function eventLocalInput(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso));
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

// Resolve wall-clock input in the event's timezone, independently of the server.
// Reject nonexistent DST times instead of silently moving the event one hour.
export function eventLocalToIso(value: string, timeZone: EventTimeZone): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error("Choose a valid date and time.");
  const target = Date.parse(`${value}:00Z`);
  if (!Number.isFinite(target)) throw new Error("Choose a valid date and time.");
  if (new Date(target).toISOString().slice(0, 16) !== value) throw new Error("Choose a valid calendar date.");
  let instant = target;
  for (let i = 0; i < 4; i++) {
    const shown = eventLocalInput(new Date(instant).toISOString(), timeZone);
    const correction = target - Date.parse(`${shown}:00Z`);
    if (!correction) return new Date(instant).toISOString();
    instant += correction;
  }
  throw new Error("That local time does not exist because the clocks change. Choose another time.");
}
