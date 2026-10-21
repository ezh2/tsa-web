export function fmtDateTime(iso: string, timeZone = "America/Chicago"): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDateRange(startsAt: string, endsAt: string | null, timeZone = "America/Chicago"): string {
  const start = fmtDateTime(startsAt, timeZone);
  if (!endsAt) return start;
  const sameDay =
    new Date(startsAt).toLocaleDateString("en-US", { timeZone }) === new Date(endsAt).toLocaleDateString("en-US", { timeZone });
  if (sameDay) {
    const endTime = new Date(endsAt).toLocaleTimeString("en-US", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
    });
    return `${start} – ${endTime}`;
  }
  return `${start} – ${fmtDateTime(endsAt, timeZone)}`;
}

export function fmtEventDate(event: { starts_at: string; ends_at: string | null; time_zone: string; time_tba: boolean; time_note: string }): string {
  const timeZone = event.time_zone || "America/Chicago";
  if (event.time_tba) return `${new Date(event.starts_at).toLocaleDateString("en-US", { timeZone, month: "short", day: "numeric", year: "numeric" })} · ${event.time_note || "Time to be announced"}`;
  return `${fmtDateRange(event.starts_at, event.ends_at, timeZone)} (${timeZone})`;
}

export function toDatetimeLocalInput(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}
