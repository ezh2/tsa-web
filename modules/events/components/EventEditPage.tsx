import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/modules/events/server/queries";
import { updateEventAction } from "@/modules/events/server/actions";
import { resolveEventFormError } from "@/modules/events/lib/errors";
import { EventForm } from "./EventForm";
import { DeleteEventButton } from "./DeleteEventButton";

export async function EventEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const event = await getEventById(id);
  if (!event) notFound();

  const message = resolveEventFormError(error);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16">
      <Link
        href="/admin/events"
        className="text-sm text-neutral-600 hover:text-neutral-900"
      >
        ← Manage events
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Director · Events
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
          Edit event
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Times are interpreted in the server&apos;s local timezone.
        </p>
      </header>

      {message && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {message}
        </div>
      )}

      <EventForm
        action={updateEventAction}
        event={event}
        submitLabel="Save changes"
        cancelHref="/admin/events"
      />

      <section className="mt-10 rounded-xl border border-red-200 bg-red-50/40 p-5">
        <h2 className="text-sm font-semibold text-red-800">Danger zone</h2>
        <p className="mt-1 text-xs text-red-700">
          Deleting this event also removes all RSVPs. This cannot be undone.
        </p>
        <div className="mt-4">
          <DeleteEventButton eventId={event.id} eventTitle={event.title} />
        </div>
      </section>
    </main>
  );
}
