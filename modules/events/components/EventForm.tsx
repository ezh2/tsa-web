import Link from "next/link";
import type { EventRecord } from "@/modules/events/types";
import { eventLocalInput, EVENT_TIME_ZONES } from "../lib/timezone";
import { MediaField } from "@/modules/content";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-900";

type ServerAction = (formData: FormData) => void | Promise<void>;

interface EventFormProps {
  action: ServerAction;
  event?: EventRecord;
  submitLabel: string;
  cancelHref: string;
}

export function EventForm({
  action,
  event,
  submitLabel,
  cancelHref,
}: EventFormProps) {
  const startsDefault = event
    ? eventLocalInput(event.starts_at, event.time_zone ?? "America/Chicago")
    : "";
  const endsDefault = event?.ends_at
    ? eventLocalInput(event.ends_at, event.time_zone ?? "America/Chicago")
    : "";

  return (
    <form
      action={action}
      className="mt-8 space-y-5 rounded-xl border border-neutral-200 bg-white p-6"
    >
      {event && <input type="hidden" name="id" value={event.id} />}

      <label className="flex items-center justify-between gap-4 rounded-md bg-neutral-50 p-4 text-sm">
        <span><strong>Published</strong><span className="mt-1 block text-xs text-neutral-500">Turn off to save a draft. Drafts are hidden from visitors.</span></span>
        <input type="checkbox" name="is_published" defaultChecked={event?.is_published ?? true} className="h-5 w-5 accent-neutral-900" />
      </label>

      <Field label="Title" name="title" required>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={200}
          defaultValue={event?.title ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Description" name="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event?.description ?? ""}
          className={inputClass}
        />
      </Field>

      <Field label="Location" name="location">
        <input
          id="location"
          name="location"
          type="text"
          defaultValue={event?.location ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Starts at" name="starts_at" required>
          <input
            id="starts_at"
            name="starts_at"
            type="datetime-local"
            required
            defaultValue={startsDefault}
            className={inputClass}
          />
        </Field>
        <Field label="Ends at" name="ends_at">
          <input
            id="ends_at"
            name="ends_at"
            type="datetime-local"
            defaultValue={endsDefault}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Event timezone" name="time_zone" required>
        <select id="time_zone" name="time_zone" defaultValue={event?.time_zone ?? "America/Chicago"} className={inputClass}>
          {EVENT_TIME_ZONES.map((zone) => <option key={zone} value={zone}>{zone}</option>)}
        </select>
      </Field>
      <label className="flex items-center gap-3 text-sm"><input type="checkbox" name="time_tba" defaultChecked={event?.time_tba ?? false} className="h-4 w-4 accent-neutral-900" />Display the date only; exact time is to be announced</label>
      <Field label="Time announcement note (optional)" name="time_note">
        <input id="time_note" name="time_note" defaultValue={event?.time_note ?? ""} placeholder="Time announced through TSA channels" className={inputClass} />
      </Field>
      <MediaField label="Event image" name="image_url" defaultValue={event?.image_url ?? ""} />
      <Field label="Registration or information link (optional)" name="link_url">
        <input id="link_url" name="link_url" defaultValue={event?.link_url ?? ""} placeholder="https://…" className={inputClass} />
      </Field>

      <Field label="Capacity (optional)" name="capacity">
        <input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          step={1}
          defaultValue={event?.capacity ?? ""}
          className={inputClass}
        />
      </Field>

      <div className="flex gap-2 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          {submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-medium text-neutral-700"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}
