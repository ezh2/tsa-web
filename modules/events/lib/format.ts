export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function fmtDateRange(startsAt: string, endsAt: string | null): string {
  const start = fmtDateTime(startsAt);
  if (!endsAt) return start;
  const sameDay =
    new Date(startsAt).toDateString() === new Date(endsAt).toDateString();
  if (sameDay) {
    const endTime = new Date(endsAt).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${start} – ${endTime}`;
  }
  return `${start} – ${fmtDateTime(endsAt)}`;
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
