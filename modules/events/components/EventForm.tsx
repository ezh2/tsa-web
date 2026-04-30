import Link from "next/link";
import type { EventRecord } from "@/modules/events/types";
import { toDatetimeLocalInput } from "@/modules/events/lib/format";

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
    ? toDatetimeLocalInput(new Date(event.starts_at))
    : "";
  const endsDefault = event?.ends_at
    ? toDatetimeLocalInput(new Date(event.ends_at))
    : "";

  return (
    <form
      action={action}
      className="mt-8 space-y-5 rounded-xl border border-neutral-200 bg-white p-6"
    >
      {event && <input type="hidden" name="id" value={event.id} />}

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
