import Link from "next/link";
import { createEventAction } from "@/modules/events/server/actions";
import { resolveEventFormError } from "@/modules/events/lib/errors";
import { EventForm } from "./EventForm";

export async function EventCreatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
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
          New event
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
        action={createEventAction}
        submitLabel="Create event"
        cancelHref="/admin/events"
      />
    </main>
  );
}
