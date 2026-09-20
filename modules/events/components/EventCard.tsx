"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";

export type EventCardEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  href?: string;
  image?: {
    src: StaticImageData;
    alt: string;
  };
};

function EventSummary({ event }: { event: EventCardEvent }) {
  return (
    <>
      {event.image && (
        <Image
          src={event.image.src}
          alt=""
          fill
          aria-hidden
          className="pointer-events-none object-cover opacity-8"
          sizes="(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 100vw"
        />
      )}
      <div className="relative flex min-h-32 flex-col justify-between p-3 text-left">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase leading-tight tracking-wider text-neutral-500">
            {event.date}
          </p>
          <h3 className="mt-1.5 text-sm font-semibold leading-tight text-neutral-950">
            {event.title}
          </h3>
        </div>
        <dl className="mt-3 grid gap-2 text-[0.7rem] leading-tight text-neutral-700">
          <div className="min-w-0">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-neutral-400">
              Time
            </dt>
            <dd className="mt-0.5 font-medium">{event.time}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-neutral-400">
              Location
            </dt>
            <dd className="mt-0.5 line-clamp-2 font-medium">
              {event.location}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}

export function EventCard({ event }: { event: EventCardEvent }) {
  const [open, setOpen] = useState(false);

  if (!event.image) {
    return (
      <article className="relative overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400">
        <EventSummary event={event} />
      </article>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400"
      >
        <EventSummary event={event} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`event-dialog-${event.title}`}
          onClick={() => setOpen(false)}
        >
          <article
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white opacity-100 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={event.image.src}
                alt={event.image.alt}
                className="aspect-[4/3] w-full object-cover"
                sizes="(min-width: 768px) 672px, 100vw"
                priority
              />
              <button
                type="button"
                aria-label="Close event details"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white transition hover:bg-black"
              >
                Close
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {event.date}
              </p>
              <h3
                id={`event-dialog-${event.title}`}
                className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950"
              >
                {event.title}
              </h3>
              <dl className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Date
                  </dt>
                  <dd className="mt-1 font-medium">{event.date}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Time
                  </dt>
                  <dd className="mt-1 font-medium">{event.time}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Location
                  </dt>
                  <dd className="mt-1 font-medium">{event.location}</dd>
                </div>
              </dl>
              {event.description && (
                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  {event.description}
                </p>
              )}
              {event.href && (
                <Link
                  href={event.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="mt-5 inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                  Open sign-up form
                </Link>
              )}
            </div>
          </article>
        </div>
      )}
    </>
  );
}
