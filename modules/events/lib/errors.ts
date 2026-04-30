export const EVENT_FORM_ERROR_MESSAGES: Record<string, string> = {
  title_required: "Title is required.",
  starts_at_required: "Start time is required.",
  invalid_capacity: "Capacity must be a positive whole number.",
  ends_before_starts: "End time must be after the start time.",
};

export function resolveEventFormError(code: string | undefined): string | null {
  if (!code) return null;
  return EVENT_FORM_ERROR_MESSAGES[code] ?? code;
}
